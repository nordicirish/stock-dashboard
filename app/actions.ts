"use server";

import { prisma } from '@/lib/prisma';
import { StockData, StockListing, YahooQuote, Stock } from "@/types/stock";

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
    exchange: quote.exchange,
  }));
}

export async function addStock(userId: string, stock: Stock) {
  await prisma.stock.create({
    data: {
      userId,
      symbol: stock.symbol,
      name: stock.name,
      quantity: stock.quantity,
      price: stock.price,
    },
  });
}

export async function getStocks(userId: string): Promise<Stock[]> {
  return prisma.stock.findMany({
    where: { userId },
  });
}

export async function updateStock(userId: string, stock: Stock) {
  await prisma.stock.update({
    where: { userId_symbol: { userId, symbol: stock.symbol } },
    data: {
      quantity: stock.quantity,
      price: stock.price,
    },
  });
}

export async function deleteStock(userId: string, symbol: string) {
  await prisma.stock.delete({
    where: { userId_symbol: { userId, symbol } },
  });
}
