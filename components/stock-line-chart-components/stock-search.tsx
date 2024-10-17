"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { StockListing } from "@/types/stock";
import { searchStocks } from "@/app/actions/stock-actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useStock } from "@/context/stock-context";

interface StockSearchProps {
  placeholder?: string;
}

export function StockSearch({
  placeholder = "Search stocks...",
}: StockSearchProps) {
  const { selectedStockListing, setSelectedStockListing } = useStock();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stocks, setStocks] = useState<StockListing[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedStockListing) {
      setSearchValue(`${selectedStockListing.symbol} - ${selectedStockListing.name}`);
    } else {
      setSearchValue("");
    }
  }, [selectedStockListing]);

  const handleStockSelect = (stockListing: StockListing) => {
    setSelectedStockListing(stockListing);
    setOpen(false);
  };

  const handleSearch = useCallback(async (value: string) => {
    setSearchValue(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchStocks(value);
        setStocks(results);
      } catch (error) {
        console.error("Error searching stocks:", error);
        setStocks([]);
      }
    }, 300);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200 h-10"
        >
          {searchValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2">
          <input
            className="w-full p-2 border rounded text-foreground bg-background"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {stocks.length > 0 ? (
            <ul className="p-2">
              {stocks.map((stock) => (
                <li
                  key={stock.symbol}
                  className="cursor-pointer p-2 text-foreground transition-colors"
                  onClick={() => handleStockSelect(stock)}
                >
                  {stock.symbol} - {stock.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-2 text-center text-muted-foreground">
              {searchValue
                ? "No stocks found."
                : "Start typing to search stocks."}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
