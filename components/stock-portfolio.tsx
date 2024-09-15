import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Stock } from "@/types/stock";
import { getCurrentPrices } from "@/app/actions";
import { StockPieChart } from "./stock-portfolio-components/stock-pie-chart";
import { StockTable } from "./stock-portfolio-components/stock-table";
import { StockFormModal } from "./stock-portfolio-components/stock-form-modal";

interface StockPortfolioProps {
  stocks: Stock[];
  onAddStock: (stock: Omit<Stock, "id">) => void;
  onUpdateStock: (stock: Stock) => void;
  onDeleteStock: (stockId: number) => void;
}

export function StockPortfolio({
  stocks,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
}: StockPortfolioProps) {
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [addingStock, setAddingStock] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      try {
        const symbols = stocks.map(stock => stock.symbol);
        const prices = await getCurrentPrices(symbols);
        setCurrentPrices(prices);
        setError(null);
      } catch (error) {
        console.error('Error fetching current prices:', error);
        setError('Unable to fetch current prices. Using average prices instead.');
      }
    };

    fetchCurrentPrices();
    const interval = setInterval(fetchCurrentPrices, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [stocks]);

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