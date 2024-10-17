"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { StockListing, Stock, NewStock, UpdateStock } from "@/types/stock";
import {
  getStocks,
  updateStock,
  deleteStock,
  addStock,
  getCurrentPrices,
} from "@/app/actions/stock-actions";
import { useSession } from "next-auth/react";

type StockContextType = {
  selectedStock: Stock | null;
  setSelectedStock: (stock: Stock | null) => void;
  selectedStockListing: StockListing | null;
  setSelectedStockListing: (stockListing: StockListing | null) => void;
  stocks: Stock[];
  currentPrices: Record<string, { price: number; percentChange: number }>;
  isLoading: boolean;
  isPending: boolean;
  error: string | null;
  handleAddStock: (newStock: NewStock) => Promise<void>;
  handleUpdateStock: (updatedStock: UpdateStock) => Promise<void>;
  handleDeleteStock: (stockId: number) => Promise<void>;
  refreshData: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedStockListing, setSelectedStockListing] =
    useState<StockListing | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, { price: number; percentChange: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session } = useSession();

  const fetchStocks = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks.length > 0 ? fetchedStocks : []);
      return fetchedStocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError("Failed to fetch stocks. Please try again.");
      setStocks([]);
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
    if (session?.user?.id) {
      refreshData();
    }
  }, [session, refreshData]);

  const handleAddStock = async (newStock: NewStock) => {
    if (!session?.user?.id) {
      setError("You must be logged in to add stocks.");
      return;
    }
    setIsPending(true);
    try {
      await addStock({ ...newStock, userId: session.user.id });
      await refreshData();
    } catch (error) {
      console.error("Error adding stock:", error);
      setError("Failed to add stock. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdateStock = async (updatedStock: UpdateStock) => {
    if (!session?.user?.id) {
      setError("You must be logged in to update stocks.");
      return;
    }
    setIsPending(true);
    try {
      await updateStock(updatedStock);
      await refreshData();
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("Failed to update stock. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    if (!session?.user?.id) {
      setError("You must be logged in to delete stocks.");
      return;
    }
    setIsPending(true);
    try {
      await deleteStock(stockId);
      await refreshData();
    } catch (error) {
      console.error("Error deleting stock:", error);
      setError("Failed to delete stock. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <StockContext.Provider
      value={{
        selectedStock,
        setSelectedStock,
        selectedStockListing,
        setSelectedStockListing,
        stocks,
        currentPrices,
        isLoading,
        isPending,
        error,
        handleAddStock,
        handleUpdateStock,
        handleDeleteStock,
        refreshData,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
}
