"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchStockData } from "@/app/actions/stock-actions";
import { StockSearch } from "./stock-search";
import { TimeframeSelect } from "./timeframe-select";
import { StockData } from "@/types/stock";
import {
  formatDateForTooltip,
  formatTimeForXAxis,
  formatDateLabel,
  getDefaultStock,
} from "@/lib/utils";
import { useStock } from "@/context/stock-context";
import { LoadingSpinner } from "../ui/loading-spinner";
import { clsx } from "clsx";

export default function StockLineChart() {
  const { selectedStockListing } = useStock();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [defaultStock] = useState(getDefaultStock());

  const updateStockData = useCallback(() => {
    const stockToFetch = selectedStockListing || defaultStock;
    startTransition(async () => {
      try {
        const data = await fetchStockData(
          stockToFetch.symbol,
          selectedTimeframe
        );
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    });
  }, [selectedStockListing, defaultStock, selectedTimeframe]);

  useEffect(() => {
    updateStockData();
    const intervalId = setInterval(updateStockData, 60000); // Refresh every minute

    // Reset the prevDate and labelCount when timeframe changes
    formatTimeForXAxis.prevDate = "";
    formatTimeForXAxis.labelCount = 0;

    return () => clearInterval(intervalId);
  }, [updateStockData, selectedTimeframe]);

  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold mb-4">Research and Analysis </h2>
        <div className="flex flex-col w-full mx-auto sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <StockSearch placeholder="Search stocks..." />
          <TimeframeSelect
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
          />
        </div>
        {!selectedStockListing && (
          <div className="text-sm text-gray-500 text-center pt-4">
            Showing {defaultStock.name} (Default)
          </div>
        )}
        {(selectedStockListing || defaultStock) &&
          selectedTimeframe === "1D" &&
          stockData && (
            <div className="text-sm text-gray-500 text-center mt-2">
              {formatDateLabel(stockData.data[0].timestamp, stockData.timezone)}
            </div>
          )}
      </CardHeader>
      <CardContent
        className={clsx(
          "transition-all duration-500 ease-in-out flex-grow",
          isPending ? "opacity-50 scale-95" : "opacity-100 scale-100"
        )}
      >
        {" "}
        {/* Container for LineChart */}
        {isPending ? (
          <LoadingSpinner message="Fetching data..." height="400px" size={24} />
        ) : stockData ? (
          <div className="w-full">
            {" "}
            {/* Container for ResponsiveContainer */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stockData.data} height={400}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) =>
                    formatTimeForXAxis(
                      timestamp,
                      selectedTimeframe,
                      stockData.timezone
                    )
                  }
                  style={{ fontSize: 12 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    lineHeight: "1.5rem",
                    fontSize: "0.8rem",
                  }}
                  labelFormatter={(label) =>
                    formatDateForTooltip(
                      label,
                      selectedTimeframe,
                      stockData.timezone
                    )
                  }
                  formatter={(value) => [
                    `$${Number(value).toFixed(2)}`,
                    "Price",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[400px]">
            Unable to load stock data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
