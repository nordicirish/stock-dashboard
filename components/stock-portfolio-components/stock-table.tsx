"use client";

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
import {
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Stock } from "@/types/stock";
import { useTheme } from "next-themes";
import { useIsMobile } from "../../hooks/use-mobile";
import { StockTableProps, SortOrder } from "@/types/stock";

export function StockTable({
  stocks,
  currentPrices,
  onEdit,
  onDelete,
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
          const isGain = currentPriceData.percentChange >= 0;
          const textColor =
            theme === "dark"
              ? isGain
                ? "text-green-400"
                : "text-red-400"
              : isGain
              ? "text-green-600"
              : "text-red-600";

          const totalGainValue =
            (currentPriceData.price - stock.avgPrice) * stock.quantity;
          const totalGainPercent =
            ((currentPriceData.price - stock.avgPrice) / stock.avgPrice) * 100;
          const isTotalGain = totalGainValue >= 0;
          const totalGainTextColor =
            theme === "dark"
              ? isTotalGain
                ? "text-green-400"
                : "text-red-400"
              : isTotalGain
              ? "text-green-600"
              : "text-red-600";

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
                      ${stock.avgPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      ${currentPriceData.price.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-center ${textColor}`}>
                      <div className="flex items-center justify-center">
                        {isGain ? (
                          <TrendingUp className="inline mr-1 h-4 w-4" />
                        ) : (
                          <TrendingDown className="inline mr-1 h-4 w-4" />
                        )}
                        ${Math.abs(dailyChangePerShare).toFixed(2)} (
                        {currentPriceData.percentChange.toFixed(2)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      $
                      {totalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className={`text-center ${totalGainTextColor}`}>
                      <div className="flex items-center justify-center">
                        {isTotalGain ? (
                          <TrendingUp className="inline mr-1 h-4 w-4" />
                        ) : (
                          <TrendingDown className="inline mr-1 h-4 w-4" />
                        )}
                        $
                        {Math.abs(totalGainValue).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        ({totalGainPercent.toFixed(2)}%)
                      </div>
                    </TableCell>
                  </>
                )}
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => onEdit(stock)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(stock.id!)}
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
                      <div>Avg Purc Price: ${stock.avgPrice.toFixed(2)}</div>
                      <div>Current: ${currentPriceData.price.toFixed(2)}</div>
                      <div className={textColor}>
                        Daily: ${Math.abs(dailyChangePerShare).toFixed(2)} (
                        {currentPriceData.percentChange.toFixed(2)}%)
                      </div>
                      <div>
                        Value: $
                        {totalValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className={totalGainTextColor}>
                        Gain: $
                        {Math.abs(totalGainValue).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        ({totalGainPercent.toFixed(2)}%)
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
