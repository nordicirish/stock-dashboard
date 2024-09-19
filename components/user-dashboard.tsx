// components/UserDashboard.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { StockPortfolio } from "./stock-portfolio-components/stock-portfolio";
import { Stock } from "@/types/stock";
import {
  getStocks,
  updateStock,
  deleteStock,
  addStock,
  getCurrentPrices,
} from "@/app/actions";

export function UserDashboard() {
  const { user } = useUser();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, { price: number; percentChange: number }>
  >({});

  useEffect(() => {
    if (user) {
      fetchStocks();
    }
  }, [user]);

  const fetchStocks = async () => {
    if (user) {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks);
      const symbols = fetchedStocks.map((stock) => stock.symbol);
      const prices = await getCurrentPrices(symbols);
      setCurrentPrices(prices);
    }
  };

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    if (user) {
      await addStock( newStock);
      await fetchStocks();
    }
  };

  const handleUpdateStock = async (updatedStock: Stock) => {
    if (user) {
      await updateStock(updatedStock);
      await fetchStocks();
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    if (user) {
      await deleteStock(stockId);
      await fetchStocks();
    }
  };

  if (!user) {
    return <div>Please sign in to view your stock portfolio.</div>;
  }

  return (
    <StockPortfolio
      stocks={stocks}
      currentPrices={currentPrices}
      onAddStock={handleAddStock}
      onUpdateStock={handleUpdateStock}
      onDeleteStock={handleDeleteStock}
    />
  );
}
