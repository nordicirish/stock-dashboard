import { useState, useCallback, useRef } from "react";
import { StockListing } from "@/types/stock";
import { searchStocks } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

interface StockSearchProps {
  onStockSelect: (stock: StockListing) => void;
  placeholder?: string;
}

export function StockSearch({ onStockSelect, placeholder = "Search stocks..." }: StockSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stocks, setStocks] = useState<StockListing[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchStocks(value);
        setStocks(results || []);
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
          className="w-full justify-between"
        >
          {searchValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2">
          <input
            className="w-full p-2 border rounded"
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
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => {
                    onStockSelect(stock);
                    setSearchValue(`${stock.symbol} - ${stock.name}`);
                    setOpen(false);
                  }}
                >
                  {stock.symbol} - {stock.name} ({stock.exchange})
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-2 text-center text-gray-500">
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
