"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSession } from "next-auth/react";
import StockLineChart from "./stock-line-chart-components/stock-line-chart";
import { StockPortfolio } from "./stock-portfolio-components/stock-portfolio";
import { Stock } from "@/types/stock";
import AiStockNews from "@/components/ai-stock-news";
import {
  getStocks,
  updateStock,
  deleteStock,
  addStock,
  getCurrentPrices,
} from "@/app/actions/user-actions";
import { StockProvider } from "@/context/stock-context";

export default function UserDashboard() {
  const { status } = useSession();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, { price: number; percentChange: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

 

  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks);
      return fetchedStocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentPrices = useCallback(async (stocksToFetch: Stock[]) => {
    try {
      const symbols = stocksToFetch.map((stock) => stock.symbol);
      const prices = await getCurrentPrices(symbols);
      setCurrentPrices(prices);
    } catch (error) {
      console.error("Error fetching current prices:", error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    const fetchedStocks = await fetchStocks();
    if (fetchedStocks) {
      await fetchCurrentPrices(fetchedStocks);
    }
  }, [fetchStocks, fetchCurrentPrices]);

  useEffect(() => {
    if (status === "authenticated") {
      refreshData();
      const intervalId = setInterval(refreshData, 60000); // Refresh every 60 seconds
      return () => clearInterval(intervalId);
    }
  }, [refreshData, status]);

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      await addStock(newStock);
      await refreshData();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (updatedStock: Stock) => {
    try {
      await updateStock(updatedStock);
      await refreshData();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };
  const handleDeleteStock = async (stockId: number) => {
    try {
      await deleteStock(stockId);
      await refreshData();
    } catch (error) {
      setError("Error deleting stock");
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-600">
          Please sign in to view your stock portfolio.
        </p>
      </div>
    );
  }

  return (
    <StockProvider>
      <div className="flex-1 p-0 sm:p-4 ">
        <StockPortfolio
          stocks={stocks}
          currentPrices={currentPrices}
          onAddStock={handleAddStock}
          onUpdateStock={handleUpdateStock}
          onDeleteStock={handleDeleteStock}
          isLoading={isLoading}
          isPending={isPending}
          error={error} // pass error prop down
        />
        <div className="flex flex-col md:flex-row gap-6 justify-center w-full mb-6">
          <div className="w-full md:w-1/2">
            <StockLineChart />
          </div>
          <div className="w-full md:w-1/2 h-full">
            <AiStockNews />
          </div>
        </div>
      </div>
    </StockProvider>
  );
}
