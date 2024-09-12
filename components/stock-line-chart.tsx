"use client";

import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStockData, searchStocks } from "@/app/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { StockListing, StockData } from "@/types/stock";
import { formatDateForTooltip } from "@/lib/utils";
import { formatTimeForXAxis } from "@/lib/utils"; // Add this import
import { formatDateLabel } from "@/lib/utils"; // Add this import

// Add these type definitions at the top of the file

export default function StockLineChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stocks, setStocks] = useState<StockListing[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const updateStockData = useCallback(() => {
    if (selectedStock) {
      startTransition(async () => {
        try {
          const data = await fetchStockData(
            selectedStock.symbol,
            selectedTimeframe
          );
          setStockData(data);
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      });
    }
  }, [selectedStock, selectedTimeframe]);

  useEffect(() => {
    updateStockData();
    const intervalId = setInterval(updateStockData, 60000); // Refresh every minute
    
    // Reset the prevDate and labelCount when timeframe changes
    formatTimeForXAxis.prevDate = '';
    formatTimeForXAxis.labelCount = 0;
    
    return () => clearInterval(intervalId);
  }, [updateStockData, selectedTimeframe]); // Add selectedTimeframe to the dependency array

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchStocks(value);
        setStocks(results || []); // Ensure we always set an array
      } catch (error) {
        console.error("Error searching stocks:", error);
        setStocks([]); // Set to empty array on error
      }
    }, 300);
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
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
              <div className="p-2">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Search stocks..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {Array.isArray(stocks) && stocks.length > 0 ? (
                  <ul className="p-2">
                    {stocks.map((stock) => (
                      <li
                        key={stock.symbol}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedStock(stock);
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
          <Select
            onValueChange={(value) => setSelectedTimeframe(value)}
            defaultValue={selectedTimeframe}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="5D">5 Days</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedTimeframe === "1D" && stockData && (
          <div className="text-sm text-gray-500 text-center mt-2">
            {formatDateLabel(stockData.data[0].timestamp, stockData.timezone)}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center items-center h-[400px]">
            Loading...
          </div>
        ) : stockData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stockData.data}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => formatTimeForXAxis(timestamp, selectedTimeframe, stockData.timezone)}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  color: "black",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                }}
                labelFormatter={(label) => formatDateForTooltip(label, selectedTimeframe, stockData.timezone)}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-[400px]">
            Select a stock to view data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
