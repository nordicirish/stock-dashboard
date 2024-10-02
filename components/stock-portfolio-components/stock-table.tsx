import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMobile } from "../../hooks/use-mobile";
import { StockTableProps, SortOrder } from "@/types/stock";
import {
  formatCurrency,
  calculatePercentChange,
  getTrend,
  getTrendColorClass,
} from "@/lib/utils";
import { TrendIcon } from "@/components/trend-icon";

export function StockTable({
  stocks,
  currentPrices,
  onEditStock,
  onDeleteStock,
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

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
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
              <TableHead className="text-center">Avg Purchase Price</TableHead>
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
        {sortedStocks.map((stock) => {
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

          return (
            <React.Fragment key={stock.id}>
              <TableRow className="hover:bg-muted/50 dark:bg-slate-700/50 bg-slate-100/50">
                <TableCell className="font-medium text-center">
                  {stock.symbol}
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell className="text-center">
                      {stock.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatCurrency(stock.avgPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatCurrency(currentPriceData.price)}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getTrendColorClass(
                        dailyTrend,
                        theme || "light"
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        <TrendIcon trend={dailyTrend} />
                        {formatCurrency(Math.abs(dailyChangePerShare))} (
                        {currentPriceData.percentChange.toFixed(2)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(totalValue)}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getTrendColorClass(
                        totalGainTrend,
                        theme || "light"
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        <TrendIcon trend={totalGainTrend} />
                        {formatCurrency(Math.abs(totalGainValue))} (
                        {totalGainPercent.toFixed(2)}%)
                      </div>
                    </TableCell>
                  </>
                )}
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => onEditStock(stock)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteStock(stock.id!)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {isMobile && (
                <TableRow className="hover:bg-muted/50">
                  <TableCell colSpan={2}>
                    <div className="grid grid-cols-2 gap-0 text-xs text-center">
                      <div>Quantity: {stock.quantity.toLocaleString()}</div>
                      <div>
                        Avg Purc Price: {formatCurrency(stock.avgPrice)}
                      </div>
                      <div>
                        Current: {formatCurrency(currentPriceData.price)}
                      </div>
                      <div
                        className={getTrendColorClass(
                          dailyTrend,
                          theme || "light"
                        )}
                      >
                        Daily: {formatCurrency(Math.abs(dailyChangePerShare))} (
                        {currentPriceData.percentChange.toFixed(2)}%)
                      </div>
                      <div>Value: {formatCurrency(totalValue)}</div>
                      <div
                        className={getTrendColorClass(
                          totalGainTrend,
                          theme || "light"
                        )}
                      >
                        Gain: {formatCurrency(Math.abs(totalGainValue))} (
                        {totalGainPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
