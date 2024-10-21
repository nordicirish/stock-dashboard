"use client";

import { useStock } from "@/context/stock-context";
import { StockSearchPopover } from "@/components/stock-search-popover";

interface StockSearchProps {
  placeholder?: string;
}

export function StockSearch({
  placeholder = "Search stocks...",
}: StockSearchProps) {
  const { selectedStockListing, setSelectedStockListing } = useStock();

  return (
    <StockSearchPopover
      placeholder={placeholder}
      onSelect={setSelectedStockListing}
      selectedStock={selectedStockListing}
      triggerClassName="bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200 h-10"
    />
  );
}