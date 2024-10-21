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
  setIsPending: (isPending: boolean) => void;
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
  const { data: session } = useSession();
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

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStocks();
      setStocks(data);
      const prices = await getCurrentPrices(data.map((stock) => stock.symbol));
      setCurrentPrices(prices);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Failed to fetch stock data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleUpdateStock = async (updatedStock: UpdateStock) => {
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

  const handleAddStock = async (newStock: NewStock) => {
    if (!session?.user?.id) {
      setError("You must be logged in to add stocks.");
      return;
    }
    setIsPending(true);
    try {
      const existingStock = stocks.find(
        (stock) => stock.symbol === newStock.symbol
      );
      if (existingStock) {
        // Update existing stock
        const updatedStock: UpdateStock = {
          id: existingStock.id,
          symbol: existingStock.symbol,
          name: existingStock.name,
          quantity: existingStock.quantity + newStock.quantity,
          avgPrice:
            (existingStock.avgPrice * existingStock.quantity +
              newStock.avgPrice * newStock.quantity) /
            (existingStock.quantity + newStock.quantity),
        };
        await updateStock(updatedStock);
      } else {
        // Add new stock
        await addStock({ ...newStock, userId: session.user.id });
      }
      await refreshData();
    } catch (error) {
      console.error("Error adding/updating stock:", error);
      setError("Failed to add/update stock. Please try again.");
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
        setIsPending,
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
