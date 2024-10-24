import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { clsx } from "clsx";
import { useStock } from "@/context/stock-context";
import { useMemo } from "react";

export function StockPieChart() {
  const { stocks, currentPrices, isPending } = useStock();
  const isMobile = useIsMobile();

  const outerRadius = isMobile ? 120 : 140;

  const COLORS = useMemo(() => {
    return Array.from(
      { length: stocks.length },
      (_, i) => `hsl(${i * 50}, 40%, 50%)`
    );
  }, [stocks.length]);

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
