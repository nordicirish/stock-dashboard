import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRefreshEffect } from "@/hooks/use-refresh-effect";
import { formatCurrency } from "@/lib/utils";
import { TrendIcon } from "@/components/trend-icon";
import { Stock } from "@/types/stock"; 
interface StockRowProps {
  stock: Stock & {
    currentPriceData: {
      price: number;
      percentChange: number;
    };
    totalValue: number;
    dailyChangePerShare: number;
    totalGainValue: number;
    totalGainPercent: number;
    dailyTrend: "up" | "down" | "neutral"; // Ensure this is correctly typed
    totalGainTrend: "up" | "down" | "neutral"; // Ensure this is correctly typed
    dailyTrendColorClass: string;
    totalGainColorClass: string;
  };
  onEditStock: (stock: Stock) => void;
  onDeleteStock: (id: number) => void;
  isMobile: boolean;
}

export function StockRow({
  stock,
  onEditStock,
  onDeleteStock,
  isMobile,
}: StockRowProps) {
  // Use the numeric values directly in useRefreshEffect
  useRefreshEffect(stock.dailyChangePerShare);
  useRefreshEffect(stock.totalGainValue);

  return (
    <>
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
              {formatCurrency(stock.currentPriceData.price)}
            </TableCell>
            <TableCell className={`text-center ${stock.dailyTrendColorClass}`}>
              <div className="flex items-center justify-center transition-all duration-300 ease-in-out">
                <TrendIcon trend={stock.dailyTrend} />
                {formatCurrency(Math.abs(stock.dailyChangePerShare))} (
                {stock.currentPriceData.percentChange.toFixed(2)}%)
              </div>
            </TableCell>
            <TableCell className="text-center font-medium">
              {formatCurrency(stock.totalValue)}
            </TableCell>
            <TableCell className={`text-center ${stock.totalGainColorClass}`}>
              <div className="flex items-center justify-center transition-all duration-300 ease-in-out">
                <TrendIcon trend={stock.totalGainTrend} />
                {formatCurrency(Math.abs(stock.totalGainValue))} (
                {stock.totalGainPercent.toFixed(2)}%)
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
              className="h-8 w-8 p-0
              transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-transparent"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDeleteStock(stock.id!)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700
              transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-transparent"
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
              <div>Avg Purc Price: {formatCurrency(stock.avgPrice)}</div>
              <div>Current: {formatCurrency(stock.currentPriceData.price)}</div>
              <div
                className={`${stock.dailyTrendColorClass} transition-all duration-300 ease-in-out`}
              >
                Daily: {formatCurrency(Math.abs(stock.dailyChangePerShare))} (
                {stock.currentPriceData.percentChange.toFixed(2)}%)
              </div>
              <div>Value: {formatCurrency(stock.totalValue)}</div>
              <div
                className={`${stock.totalGainColorClass} transition-all duration-300 ease-in-out`}
              >
                Gain: {formatCurrency(Math.abs(stock.totalGainValue))} (
                {stock.totalGainPercent.toFixed(2)}%)
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
