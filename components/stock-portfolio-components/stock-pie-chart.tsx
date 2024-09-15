import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

interface StockPieChartProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number, percentChange: number }>;
}

export function StockPieChart({ stocks, currentPrices }: StockPieChartProps) {
  const pieData = stocks.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    value: stock.quantity * (currentPrices[stock.symbol]?.price || stock.avgPrice),
  }));

  return (
    <div className="h-[20rem] mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={140}
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
            formatter={(value) =>
              typeof value === "number" ? `$${value.toFixed(2)}` : value
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
