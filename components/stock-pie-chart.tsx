import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";
import { AddStockForm } from "./add-stock-form";
import { Button } from "@/components/ui/button";

interface StockPieChartProps {
  stocks: Stock[];
  onAddStock: (stock: Stock) => void;
  onUpdateStock: (stock: Stock) => void;
  onDeleteStock: (symbol: string) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export function StockPieChart({ stocks, onAddStock, onUpdateStock, onDeleteStock }: StockPieChartProps) {
  const pieData = stocks.map((stock) => ({
    name: stock.name,
    value: stock.quantity * stock.price,
  }));

  if (stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Your First Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <AddStockForm onAddStock={onAddStock} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => typeof value === 'number' ? `$${value.toFixed(2)}` : value} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Your Stocks</h3>
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex justify-between items-center mt-2">
              <span>{stock.name} ({stock.quantity} @ ${stock.price})</span>
              <div>
                <Button onClick={() => onUpdateStock(stock)} className="mr-2">Update</Button>
                <Button onClick={() => onDeleteStock(stock.symbol)} variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <AddStockForm onAddStock={onAddStock} />
        </div>
      </CardContent>
    </Card>
  );
}