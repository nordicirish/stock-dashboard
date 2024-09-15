"use server";


import { StockData, StockListing, YahooQuote, Stock } from "@/types/stock";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


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

export async function searchStocks(query: string): Promise<StockListing[]> {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    query
  )}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch stock listings");
  }

  const data = await response.json();

  if (!data.quotes) {
    return [];
  }

  return data.quotes.map((quote: YahooQuote) => ({
    symbol: quote.symbol,
    name: quote.shortname || quote.longname || quote.symbol,
  }));
}

export async function addStock(userId: string, stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">): Promise<Stock> {
  try {
    // Check if the stock already exists for this user
    const existingStock = await prisma.stock.findUnique({
      where: {
        userId_symbol: {
          userId: userId,
          symbol: stockData.symbol,
        },
      },
    });

    if (existingStock) {
      // If the stock exists, update it
      const updatedStock = await prisma.stock.update({
        where: { id: existingStock.id },
        data: {
          quantity: existingStock.quantity + stockData.quantity,
          avgPrice: (existingStock.avgPrice * existingStock.quantity + stockData.avgPrice * stockData.quantity) / (existingStock.quantity + stockData.quantity),
        },
      });
      return updatedStock;
    } else {
      // If the stock doesn't exist, create a new one
      const newStock = await prisma.stock.create({
        data: {
          ...stockData,
          userId: userId,
        },
      });
      return newStock;
    }
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
}

export async function getStocks(userId: string): Promise<Stock[]> {
  return await prisma.stock.findMany({
    where: { userId: userId },
  });
}

export async function updateStock(userId: string, stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">): Promise<Stock> {
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

export async function deleteStock(userId: string, stockId: number): Promise<void> {
  await prisma.stock.delete({
    where: {
      id: stockId,
      userId: userId,
    },
  });
}

export async function getCurrentPrices(symbols: string[]): Promise<Record<string, number>> {
  const symbolString = symbols.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolString}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60 seconds
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.quoteResponse || !data.quoteResponse.result) {
      console.error('Unexpected response structure:', data);
      throw new Error('Unexpected response structure');
    }

    interface YahooQuoteResult {
      symbol: string;
      regularMarketPrice: number;
    }

    const result: Record<string, number> = {};
    data.quoteResponse.result.forEach((quote: YahooQuoteResult) => {
      if (quote.symbol && quote.regularMarketPrice) {
        result[quote.symbol] = quote.regularMarketPrice;
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching current prices:', error);
    return {}; // Return an empty object instead of throwing
  }
}
