import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Stock } from "@/types/stock";
import { StockPieChart } from "./stock-portfolio-components/stock-pie-chart";
import { StockTable } from "./stock-portfolio-components/stock-table";
import { StockFormModal } from "./stock-portfolio-components/stock-form-modal";

interface StockPortfolioProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number, percentChange: number }>;
  onAddStock: (stock: Omit<Stock, "id">) => void;
  onUpdateStock: (stock: Stock) => void;
  onDeleteStock: (stockId: number) => void;
}

export function StockPortfolio({
  stocks,
  currentPrices,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
}: StockPortfolioProps) {
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [addingStock, setAddingStock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear the error when currentPrices are updated
    if (Object.keys(currentPrices).length > 0) {
      setError(null);
    }
  }, [currentPrices]);

  if (stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Your First Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockFormModal onSubmit={onAddStock} onCancel={() => setAddingStock(false)} />
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
        <StockPieChart stocks={stocks} currentPrices={currentPrices} />
        <StockTable
          stocks={stocks}
          currentPrices={currentPrices}
          onEdit={setEditingStock}
          onDelete={onDeleteStock}
        />
        {(editingStock || addingStock) && (
          <StockFormModal
            existingStock={editingStock || undefined}
            onSubmit={(stock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => {
              if (editingStock) {
                onUpdateStock(stock as Stock);
              } else {
                onAddStock(stock);
              }
              setEditingStock(null);
              setAddingStock(false);
            }}
            onCancel={() => {
              setEditingStock(null);
              setAddingStock(false);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}