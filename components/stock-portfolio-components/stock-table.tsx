import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMobile } from "../../hooks/use-mobile";
import { StockTableProps, SortOrder } from "@/types/stock";
import {
  calculatePercentChange,
  getTrend,
  getTrendColorClass,
} from "@/lib/utils";

import { StockRow } from "@/components/stock-portfolio-components/stock-row"; // Import StockRow component

export function StockTable({
  stocks,
  currentPrices,
  onEditStock,
  onDeleteStock,
  isLoading,
}: StockTableProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      return sortOrder === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    });
  }, [stocks, sortOrder]);

  const stockData = useMemo(() => {
    return sortedStocks.map((stock) => {
      const currentPriceData = currentPrices[stock.symbol] || {
        price: stock.avgPrice,
        percentChange: 0,
      };
      const totalValue = stock.quantity * currentPriceData.price;
      const dailyChangePerShare =
        currentPriceData.price * (currentPriceData.percentChange / 100);
      const totalGainValue =
        (currentPriceData.price - stock.avgPrice) * stock.quantity;
      const totalGainPercent = calculatePercentChange(
        stock.avgPrice,
        currentPriceData.price
      );

      const dailyTrend = getTrend(currentPriceData.percentChange);
      const totalGainTrend = getTrend(totalGainValue);
      const dailyTrendColorClass = getTrendColorClass(
        dailyTrend,
        theme || "light"
      );
      const totalGainColorClass = getTrendColorClass(
        totalGainTrend,
        theme || "light"
      );

      return {
        ...stock,
        currentPriceData,
        totalValue,
        dailyChangePerShare,
        totalGainValue,
        totalGainPercent,
        dailyTrend,
        totalGainTrend,
        dailyTrendColorClass,
        totalGainColorClass,
      };
    });
  }, [sortedStocks, currentPrices, theme]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stock Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader className="dark:bg-slate-950/50 bg-slate-200/50">
            <TableRow>
              <TableHead
                className="text-center cursor-pointer"
                onClick={handleSort}
              >
                Symbol{" "}
                {sortOrder === "asc" ? (
                  <ChevronUp className="h-4 w-4 inline-block ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 inline-block ml-1" />
                )}
              </TableHead>
              {!isMobile && (
                <>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">
                    Avg Purchase Price
                  </TableHead>
                  <TableHead className="text-center">Current Price</TableHead>
                  <TableHead className="text-center">Daily Change</TableHead>
                  <TableHead className="text-center">Total Value</TableHead>
                  <TableHead className="text-center">Total Gains</TableHead>
                </>
              )}
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockData.map((stock) => (
              <StockRow
                key={stock.id}
                stock={stock}
                onEditStock={onEditStock}
                onDeleteStock={onDeleteStock}
                isMobile={isMobile ?? false}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
