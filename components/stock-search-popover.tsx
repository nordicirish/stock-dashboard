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
import { ChevronsUpDown, Search } from "lucide-react";

interface StockSearchPopoverProps {
  placeholder?: string;
  onSelect: (stock: StockListing) => void;
  selectedStock?: StockListing | null;
  triggerClassName?: string;
}

export function StockSearchPopover({
  placeholder = "Search stocks...",
  onSelect,
  selectedStock,
  triggerClassName,
}: StockSearchPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stocks, setStocks] = useState<StockListing[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedStock) {
      setSearchValue(`${selectedStock.symbol} - ${selectedStock.name}`);
    } else {
      setSearchValue("");
    }
  }, [selectedStock]);

  const handleStockSelect = (stock: StockListing) => {
    onSelect(stock);
    setOpen(false);
  };

  const handleSearch = useCallback(async (value: string) => {
    setSearchValue(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      if (value.trim()) {
        try {
          const results = await searchStocks(value);
          setStocks(results);
        } catch (error) {
          console.error("Error searching stocks:", error);
          setStocks([]);
        }
      } else {
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
          className={`w-full justify-between ${triggerClassName}`}
        >
          {searchValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="flex items-center border-b p-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex-grow bg-transparent outline-none"
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
                  className="cursor-pointer p-2 hover:bg-accent text-foreground"
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
