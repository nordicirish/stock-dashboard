import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRefreshEffect } from "@/hooks/use-refresh-effect";
import { formatCurrency } from "@/lib/utils";
import { TrendIcon } from "@/components/trend-icon";
import { Stock } from "@/types/stock";
import { useStock } from "@/context/stock-context";

interface StockRowProps {
  stock: Stock;
  isMobile: boolean;
}

export function StockRow({ stock, isMobile }: StockRowProps) {
  const { currentPrices, handleDeleteStock, setSelectedStock, setIsModalOpen } =
    useStock();

  const currentPriceData = currentPrices[stock.symbol] || {
    price: stock.avgPrice,
    percentChange: 0,
  };

  const totalValue = stock.quantity * currentPriceData.price;
  const dailyChangePerShare =
    currentPriceData.price * (currentPriceData.percentChange / 100);
  const totalGainValue =
    (currentPriceData.price - stock.avgPrice) * stock.quantity;
  const totalGainPercent =
    ((currentPriceData.price - stock.avgPrice) / stock.avgPrice) * 100;

  const dailyTrend =
    dailyChangePerShare > 0
      ? "up"
      : dailyChangePerShare < 0
      ? "down"
      : "neutral";
  const totalGainTrend =
    totalGainValue > 0 ? "up" : totalGainValue < 0 ? "down" : "neutral";

  useRefreshEffect(dailyChangePerShare);
  useRefreshEffect(totalGainValue);

  const handleEdit = () => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

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
              {formatCurrency(currentPriceData.price)}
            </TableCell>
            <TableCell
              className={`text-center ${
                dailyTrend === "up"
                  ? "text-green-500"
                  : dailyTrend === "down"
                  ? "text-red-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-center transition-all duration-300 ease-in-out">
                <TrendIcon trend={dailyTrend} />
                {formatCurrency(Math.abs(dailyChangePerShare))} (
                {currentPriceData.percentChange.toFixed(2)}%)
              </div>
            </TableCell>
            <TableCell className="text-center font-medium">
              {formatCurrency(totalValue)}
            </TableCell>
            <TableCell
              className={`text-center ${
                totalGainTrend === "up"
                  ? "text-green-500"
                  : totalGainTrend === "down"
                  ? "text-red-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-center transition-all duration-300 ease-in-out">
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
              onClick={handleEdit}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-transparent"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleDeleteStock(stock.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-transparent"
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
              <div>Current: {formatCurrency(currentPriceData.price)}</div>
              <div
                className={`${
                  dailyTrend === "up"
                    ? "text-green-500"
                    : dailyTrend === "down"
                    ? "text-red-500"
                    : ""
                } transition-all duration-300 ease-in-out`}
              >
                Daily: {formatCurrency(Math.abs(dailyChangePerShare))} (
                {currentPriceData.percentChange.toFixed(2)}%)
              </div>
              <div>Value: {formatCurrency(totalValue)}</div>
              <div
                className={`${
                  totalGainTrend === "up"
                    ? "text-green-500"
                    : totalGainTrend === "down"
                    ? "text-red-500"
                    : ""
                } transition-all duration-300 ease-in-out`}
              >
                Gain: {formatCurrency(Math.abs(totalGainValue))} (
                {totalGainPercent.toFixed(2)}%)
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
