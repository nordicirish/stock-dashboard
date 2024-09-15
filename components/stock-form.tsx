import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stock, StockListing } from "@/types/stock";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Search, DollarSign, Hash } from "lucide-react";
import { searchStocks } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface StockFormProps {
  existingStock?: Stock;
  onSubmit: (stock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
  isLoading: boolean;
}

export function StockForm({
  existingStock,
  onSubmit,
  onCancel,
  isLoading,
}: StockFormProps) {
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(
    existingStock
      ? { symbol: existingStock.symbol, name: existingStock.name }
      : null
  );
  const [quantity, setQuantity] = useState(
    existingStock?.quantity.toString() || ""
  );
  const [avgPrice, setAvgPrice] = useState(
    existingStock?.avgPrice.toString() || ""
  );
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stocks, setStocks] = useState<StockListing[]>([]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      searchStocks(value)
        .then((results) => {
          setStocks(results || []);
        })
        .catch((error) => {
          console.error("Error searching stocks:", error);
          setStocks([]);
        });
    } else {
      setStocks([]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStock) {
      onSubmit({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: Number(quantity),
        avgPrice: Number(avgPrice),
        userId: existingStock?.userId || "testuser123",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="stock-search">Stock</Label>
            {existingStock ? (
              <div className="p-2 bg-secondary rounded-md">
                {existingStock.symbol} - {existingStock.name}
              </div>
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="stock-search"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedStock
                      ? `${selectedStock.symbol} - ${selectedStock.name}`
                      : "Search stocks..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="flex items-center border-b p-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex-grow bg-transparent outline-none"
                      placeholder="Search stocks..."
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
                            onClick={() => {
                              setSelectedStock(stock);
                              setOpen(false);
                            }}
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
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Average Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="avgPrice"
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            {onCancel && (
              <Button type="button" onClick={onCancel} variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
              {isLoading ? "Loading..." : existingStock ? "Update" : "Add"} Stock
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
