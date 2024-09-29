import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo, useTransition } from "react";
import { Plus } from "lucide-react";
import { Stock } from "@/types/stock";
import { StockPieChart } from "./stock-pie-chart";
import { StockTable } from "./stock-table";
import { StockFormModal } from "./stock-form-modal";
import { Loader2 } from "lucide-react";

interface StockPortfolioProps {
  stocks: Stock[];
  currentPrices: Record<string, { price: number; percentChange: number }>;
  onAddStock: (stock: Omit<Stock, "id">) => Promise<void>;
  onUpdateStock: (stock: Stock) => Promise<void>;
  onDeleteStock: (stockId: number) => Promise<void>;
}

export function StockPortfolio({
  stocks,
  currentPrices,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
}: StockPortfolioProps) {
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
 

  const COLORS = useMemo(() => {
    return Array.from(
      { length: stocks.length },
      (_, i) => `hsl(${i * 50}, 40%, 50%)`
    );
  }, [stocks.length]);

  

  const handleAddStock = async (
    stock: Omit<Stock, "id" | "createdAt" | "updatedAt">
  ) => {
    startTransition(async () => {
      try {
        await onAddStock(stock);
        setShowModal(false);
      } catch (error) {
        console.error("Error adding stock:", error);
        setError("Failed to add stock. Please try again.");
      }
    });
  };

  const handleUpdateStock = async (stock: Stock) => {
    startTransition(async () => {
      try {
        await onUpdateStock(stock);
        setShowModal(false);
        setEditingStock(null);
      } catch (error) {
        console.error("Error updating stock:", error);
        setError("Failed to update stock. Please try again.");
      }
    });
  };

  const handleOpenModal = () => {
    setEditingStock(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingStock(null);
    setShowModal(false);
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <StockFormModal
        existingStock={editingStock || undefined}
        onSubmit={(stock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => {
          if (editingStock) {
            handleUpdateStock(stock as Stock);
          } else {
            handleAddStock(stock);
          }
        }}
        onCancel={handleCloseModal}
        isPending={isPending}
      />
    );
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isPending && stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Your First Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleOpenModal}
            variant="default"
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Stock
          </Button>
          {renderModal()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stock Portfolio</CardTitle>
        {!isPending  && stocks.length > 0 && (
          <Button
            onClick={handleOpenModal}
            variant="default"
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Stock
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}
        <StockPieChart
          stocks={stocks}
          currentPrices={currentPrices}
          COLORS={COLORS}
          isPending={isPending}
        />
        <StockTable
          stocks={stocks}
          currentPrices={currentPrices}
          onEdit={(stock) => {
            setEditingStock(stock);
            setShowModal(true);
          }}
          onDelete={onDeleteStock}
        />
        {renderModal()}
      </CardContent>
    </Card>
  );
}
