"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSession } from "next-auth/react";
import StockLineChart from "./stock-line-chart-components/stock-line-chart";
import { StockPortfolio } from "./stock-portfolio-components/stock-portfolio";
import { Stock, NewStock, UpdateStock } from "@/types/stock";
import AiStockNews from "@/components/ai-stock-news";
import {
  getStocks,
  updateStock,
  deleteStock,
  addStock,
  getCurrentPrices,
} from "@/app/actions/stock-actions";
import { StockProvider } from "@/context/stock-context";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, { price: number; percentChange: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks);
      return fetchedStocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError("Failed to fetch stocks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const fetchCurrentPrices = useCallback(async (stocksToFetch: Stock[]) => {
    try {
      const symbols = stocksToFetch.map((stock) => stock.symbol);
      const prices = await getCurrentPrices(symbols);
      setCurrentPrices(prices);
    } catch (error) {
      console.error("Error fetching current prices:", error);
      setError("Failed to fetch current prices. Please try again.");
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

  const handleAddStock = async (newStock: NewStock) => {
    if (!session?.user?.id) {
      setError("You must be logged in to add stocks.");
      return;
    }
    try {
      startTransition(async () => {
        await addStock({ ...newStock, userId: session.user.id });
        await refreshData();
      });
    } catch (error) {
      console.error("Error adding stock:", error);
      setError("Failed to add stock. Please try again.");
    }
  };

  const handleUpdateStock = async (updatedStock: UpdateStock) => {
    if (!session?.user?.id) {
      setError("You must be logged in to update stocks.");
      return;
    }
    try {
      startTransition(async () => {
        await updateStock(updatedStock);
        await refreshData();
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("Failed to update stock. Please try again.");
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    if (!session?.user?.id) {
      setError("You must be logged in to delete stocks.");
      return;
    }
    try {
      startTransition(async () => {
        await deleteStock(stockId);
        await refreshData();
      });
    } catch (error) {
      console.error("Error deleting stock:", error);
      setError("Failed to delete stock. Please try again.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-20 ">
        <p className="text-lg font-medium dark:text-gray-100 text-gray-600">
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
          error={error}
        />
        <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
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
