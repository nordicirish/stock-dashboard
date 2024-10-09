"use server";
import { StockData, StockListing, YahooQuote, Stock } from "@/types/stock";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "./user-actions";

export async function fetchStockData(
  symbol: string,
  timeframe: string
): Promise<StockData> {
  const interval =
    timeframe === "1D"
      ? "1m"
      : timeframe === "5D"
      ? "5m"
      : timeframe === "1M"
      ? "1h"
      : "1d";
  const range =
    timeframe === "1D"
      ? "1d"
      : timeframe === "5D"
      ? "5d"
      : timeframe === "1M"
      ? "1mo"
      : "1y";

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await response.json();
  const timestamps = data.chart.result[0].timestamp;
  const prices = data.chart.result[0].indicators.quote[0].close;
  const meta = data.chart.result[0].meta;

  return {
    name: meta.longName,
    symbol: meta.symbol,
    exchange: meta.exchangeName,
    data: timestamps
      .map((time: number, index: number) => ({
        timestamp: time,
        price: prices[index] || null,
      }))
      .filter((item: { price: number | null }) => item.price !== null),
    timezone: meta.timezone,
  };
}
// Search stocks based on query string. Stock symbols and names can be cached as they are not updated frequently
const searchCache: Record<string, { data: StockListing[]; timestamp: number }> =
  {};
export async function searchStocks(query: string): Promise<StockListing[]> {
  const now = Date.now();

  if (searchCache[query] && now - searchCache[query].timestamp < 300 * 1000) {
    // Use cached result if it's less than 5 minutes old
    return searchCache[query].data;
  }

  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    query
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch stock listings");
  }

  const data = await response.json();
  const results = data.quotes.map((quote: YahooQuote) => ({
    symbol: quote.symbol,
    name: quote.shortname || quote.longname || quote.symbol,
  }));

  searchCache[query] = { data: results, timestamp: now };
  return results;
}
// Add or update a stock for the current user
export async function addStock(
  stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">
): Promise<Stock> {
  const userId = await getCurrentUserId();
  try {
    const existingStock = await prisma.stock.findUnique({
      where: {
        userId_symbol: {
          userId: userId,
          symbol: stockData.symbol,
        },
      },
    });

    if (existingStock) {
      // Update existing stock
      return await prisma.stock.update({
        where: {
          userId_symbol: {
            userId: userId,
            symbol: stockData.symbol,
          },
        },
        data: {
          quantity: existingStock.quantity + stockData.quantity,
          avgPrice:
            (existingStock.avgPrice * existingStock.quantity +
              stockData.avgPrice * stockData.quantity) /
            (existingStock.quantity + stockData.quantity),
        },
      });
    } else {
      // Create new stock
      return await prisma.stock.create({
        data: {
          ...stockData,
          userId: userId,
        },
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User not authenticated") {
      // Handle the case where the user is not authenticated
      // For example, you could redirect the user to the login page
      throw new Error("Please log in to add a stock");
    } else {
      throw error;
    }
  }
}

// Get all stocks for the current user
export async function getStocks(): Promise<Stock[]> {
  const userId = await getCurrentUserId();
  return await prisma.stock.findMany({
    where: { userId: userId },
  });
}

// Update stock details for the current user
export async function updateStock(
  stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">
): Promise<Stock> {
  const userId = await getCurrentUserId();
  try {
    const updatedStock = await prisma.stock.update({
      where: {
        userId_symbol: {
          userId: userId,
          symbol: stockData.symbol,
        },
      },
      data: {
        name: stockData.name,
        quantity: stockData.quantity,
        avgPrice: stockData.avgPrice,
      },
    });
    return updatedStock;
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}

// Delete a stock for the current user
export async function deleteStock(stockId: number): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.stock.delete({
    where: {
      id: stockId,
      userId: userId,
    },
  });
}

// Fetch current prices for a list of symbols
export async function getCurrentPrices(
  symbols: string[]
): Promise<Record<string, { price: number; percentChange: number }>> {
  const result: Record<string, { price: number; percentChange: number }> = {};

  for (const symbol of symbols) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;

    try {
      const response = await fetch(url, { next: { revalidate: 60 } });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      result[symbol] = {
        price: data.c,
        percentChange: data.dp,
      };
    } catch (error) {
      console.error(`Error fetching current price for ${symbol}:`, error);
    }
  }

  return result;
}
