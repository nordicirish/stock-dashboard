import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";
import { StockWithId } from "@/components/dashboard"; // Add this import
import { AddStockForm } from "./add-stock-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface StockPieChartProps {
  stocks: StockWithId[]; // Change this to StockWithId
  onAddStock: (stock: Omit<Stock, "id">) => void;
  onUpdateStock: (stock: StockWithId) => void; // Change this to StockWithId
  onDeleteStock: (stockId: string) => void; // Change this to accept only string
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function StockPieChart({
  stocks,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
}: StockPieChartProps) {
  const [editingStock, setEditingStock] = useState<StockWithId | null>(null);

  const handleUpdateClick = (stock: StockWithId) => {
    setEditingStock(stock);
  };

  const handleUpdateSubmit = (updatedStock: StockWithId) => {
    onUpdateStock(updatedStock);
    setEditingStock(null);
  };

  const pieData = stocks.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    value: stock.quantity * stock.avgPrice,
  }));
  console.log(pieData);
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
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Your Stocks</h3>
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between items-center mt-2"
            >
              {editingStock && editingStock.symbol === stock.symbol ? (
                <UpdateStockForm
                  stock={editingStock}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => setEditingStock(null)}
                />
              ) : (
                <>
                  <span>
                    {stock.name} ({stock.quantity} @ ${stock.avgPrice})
                  </span>
                  <div>
                    <Button
                      onClick={() => handleUpdateClick(stock)}
                      className="mr-2"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => onDeleteStock(stock.id ?? "")}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {!editingStock && (
          <div className="mt-4">
            <AddStockForm onAddStock={onAddStock} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface UpdateStockFormProps {
  stock: StockWithId;
  onSubmit: (updatedStock: StockWithId) => void;
  onCancel: () => void;
}

function UpdateStockForm({ stock, onSubmit, onCancel }: UpdateStockFormProps) {
  const [quantity, setQuantity] = useState(stock.quantity.toString());
  const [avgPrice, setAvgPrice] = useState(stock.avgPrice.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...stock,
      quantity: parseFloat(quantity),
      avgPrice: parseFloat(avgPrice),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 w-full">
      <div className="font-semibold">
        {stock.name} ({stock.symbol})
      </div>
      <Input type="text" value={stock.name} readOnly className="bg-gray-100" />
      <Input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        required
      />
      <Input
        type="number"
        value={avgPrice}
        onChange={(e) => setAvgPrice(e.target.value)}
        placeholder="Average Price"
        required
      />
      <div className="space-x-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
