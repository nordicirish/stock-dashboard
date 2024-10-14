"use server";
import { StockData, StockListing, YahooQuote, Stock, NewStock,  UpdateStock } from "@/types/stock";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "./user-actions";
import { auth } from "@/auth";
// Fetch stock data from Yahoo Finance API
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
  stock: NewStock & { userId: string }
): Promise<Stock> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.stock.create({
    data: {
      ...stock,
      userId: session.user.id,
    },
  });
}



// Get all stocks for the current user
export async function getStocks(): Promise<Stock[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.stock.findMany({
    where: { userId: session.user.id },
  });
}

// Update stock details for the current user
export async function updateStock(stock: UpdateStock): Promise<Stock> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  return prisma.stock.update({
    where: { id: stock.id, userId: session.user.id,  },
    data: stock,
  });
}
export async function deleteStock(stockId: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  await prisma.stock.delete({
    where: { id: stockId, userId: session.user.id },
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
