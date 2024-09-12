import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";
import { StockForm } from "./stock-form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { addStock, updateStock } from "@/app/actions"; // Add this import

interface StockPieChartProps {
  stocks: Stock[];
  onAddStock: (stock: Omit<Stock, "id">) => void;
  onUpdateStock: (stock: Stock) => void;
  onDeleteStock: (stockId: number) => void;
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
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [pieData, setPieData] = useState<
    Array<{ symbol: string; name: string; value: number }>
  >([]);

  useEffect(() => {
    const newPieData = stocks.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      value: stock.quantity * stock.avgPrice,
    }));
    setPieData(newPieData);
  }, [stocks]);

  const handleUpdateClick = (stock: Stock) => {
    setEditingStock(stock);
  };

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      const addedStock = await addStock("testuser123", newStock);
      // Check if the stock already exists in the local state
      const existingIndex = stocks.findIndex(s => s.symbol === addedStock.symbol);
      if (existingIndex !== -1) {
        // If it exists, update it
        const updatedStocks = [...stocks];
        updatedStocks[existingIndex] = addedStock;
        onUpdateStock(addedStock);
      } else {
        // If it's new, add it
        onAddStock(addedStock);
      }
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (updatedStock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => {
    try {
      const updated = await updateStock("testuser123", updatedStock);
      onUpdateStock(updated);
      setEditingStock(null);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  if (stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Your First Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockForm onSubmit={handleAddStock} />
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
        <div className="h-[20rem]">
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
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Your Stocks</h3>
          {stocks.map((stock) => (
            <div
              key={stock.id}
              className="flex justify-between items-center mt-2"
            >
              {editingStock && editingStock.id === stock.id ? (
                <StockForm
                  existingStock={editingStock}
                  onSubmit={handleUpdateStock}
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
                      onClick={() => onDeleteStock(stock.id!)}
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
            <StockForm onSubmit={handleAddStock} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
