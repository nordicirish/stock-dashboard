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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(currentPrices).length > 0) {
      setError(null);
    }
  }, [currentPrices]);

  const handleAddStock = async (stock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true);
    try {
      await onAddStock(stock);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding stock:", error);
      setError("Failed to add stock. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (stock: Stock) => {
    setIsLoading(true);
    try {
      await onUpdateStock(stock);
      setShowModal(false);
      setEditingStock(null);
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("Failed to update stock. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
      />
    );
  };

  if (stocks.length === 0) {
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
        <Button
          onClick={handleOpenModal}
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