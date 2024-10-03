import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { clsx } from "clsx";
import { LoadingSpinner } from "../ui/loading-spinner";

interface StockPieChartProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number; percentChange: number }>;
  COLORS: string[];
  isPending: boolean;
  isLoading: boolean;
}

export function StockPieChart({
  stocks,
  currentPrices,
  COLORS,
  isPending,
  isLoading,
}: StockPieChartProps) {
  const isMobile = useIsMobile();

  const outerRadius = isMobile ? 100 : 140;

  const pieData = stocks.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    value:
      stock.quantity * (currentPrices[stock.symbol]?.price || stock.avgPrice),
  }));

  return (
    <Card
      className={clsx(
        "h-[30rem] min-h-[30rem] w-full flex flex-1 flex-col items-center justify-start transition-all duration-500 ease-in-out",
        isPending ? "opacity-50 scale-95" : "opacity-100 scale-100"
      )}
    >
      <CardHeader>
        <CardTitle>Portfolio Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              fontSize={isMobile ? 10 : 14}
              fill="#8884d8"
              dataKey="value"
              label={({ symbol, percent }) =>
                `${symbol} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: "0.875rem",
                backgroundColor: "white",
                color: "black",
              }}
              formatter={(value) =>
                typeof value === "number" ? `$${value.toFixed(2)}` : value
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
