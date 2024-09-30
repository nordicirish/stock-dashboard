"use client";
// stores selected stock in context and allows it to be accessed from any component
import React, { createContext, useState, useContext, ReactNode } from "react";
import { StockListing } from "@/types/stock";

type StockContextType = {
  selectedStock: StockListing | null;
  setSelectedStock: (stock: StockListing | null) => void;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(null);

  return (
    <StockContext.Provider value={{ selectedStock, setSelectedStock }}>
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
