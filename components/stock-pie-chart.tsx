import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Stock } from "@/types/stock";
import { StockForm } from "./stock-form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { addStock, updateStock } from "@/app/actions";
import { X, Plus, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentPrices } from "@/app/actions";
import { useTheme } from "next-themes";

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
  const [addingStock, setAddingStock] = useState(false);
  const [pieData, setPieData] = useState<
    Array<{ symbol: string; name: string; value: number }>
  >([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const newPieData = stocks.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      value: stock.quantity * stock.avgPrice,
    }));
    setPieData(newPieData);

    const fetchCurrentPrices = async () => {
      try {
        const symbols = stocks.map(stock => stock.symbol);
        const prices = await getCurrentPrices(symbols);
        setCurrentPrices(prices);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching current prices:', error);
        setError('Unable to fetch current prices. Using average prices instead.');
      }
    };

    fetchCurrentPrices();
    const interval = setInterval(fetchCurrentPrices, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [stocks]);

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      const addedStock = await addStock("testuser123", newStock);
      onAddStock(addedStock);
      setAddingStock(false);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (
    updatedStock: Omit<Stock, "id" | "createdAt" | "updatedAt">
  ) => {
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stock Portfolio</CardTitle>
        <Button
          onClick={() => setAddingStock(true)}
          variant="default"
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Stock
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}
        {stocks.length > 0 ? (
          <>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Avg Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Daily Gain/Loss</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  const currentPrice = currentPrices[stock.symbol] || stock.avgPrice;
                  const dailyGainLoss = (currentPrice - stock.avgPrice) * stock.quantity;
                  const isGain = dailyGainLoss >= 0;
                  const textColor = theme === 'dark' 
                    ? (isGain ? 'text-green-400' : 'text-red-400')
                    : (isGain ? 'text-green-600' : 'text-red-600');

                  return (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell>{stock.quantity}</TableCell>
                      <TableCell>${stock.avgPrice.toFixed(2)}</TableCell>
                      <TableCell>${(stock.quantity * currentPrice).toFixed(2)}</TableCell>
                      <TableCell className={textColor}>
                        {isGain ? '+' : '-'}${Math.abs(dailyGainLoss).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setEditingStock(stock)}
                          variant="ghost"
                          size="sm"
                          className="mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => onDeleteStock(stock.id!)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg mb-4">You haven&apos;t added any stocks yet.</p>
            <Button 
              onClick={() => setAddingStock(true)} 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Your First Stock
            </Button>
          </div>
        )}

        {(editingStock || addingStock) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {editingStock ? `Edit Stock: ${editingStock.symbol}` : "Add New Stock"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    editingStock ? setEditingStock(null) : setAddingStock(false)
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <StockForm
                  existingStock={editingStock || undefined}
                  onSubmit={(stock) => {
                    if (editingStock) {
                      handleUpdateStock(stock);
                    } else {
                      handleAddStock(stock);
                    }
                  }}
                  onCancel={() =>
                    editingStock ? setEditingStock(null) : setAddingStock(false)
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
