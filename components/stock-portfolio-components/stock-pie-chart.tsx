import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

interface StockPieChartProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number; percentChange: number }>;
  COLORS: string[];
  isPending: boolean;
}

export function StockPieChart({
  stocks,
  currentPrices,
  COLORS,
  isPending,
}: StockPieChartProps) {
  const isMobile = useIsMobile();

  const outerRadius = isMobile ? 100 : 140;
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  const pieData = stocks.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    value:
      stock.quantity * (currentPrices[stock.symbol]?.price || stock.avgPrice),
  }));

  return (
    <div className="h-[22rem] min-h-[22rem] w-full mb-6">
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
    </div>
  );
}
