import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Stock } from "@/types/stock";
import { StockPieChart } from "./stock-pie-chart";
import { StockTable } from "./stock-table";
import { StockFormModal } from "./stock-form-modal";
import { StockPortfolioProps } from "@/types/stock";
import { Loader2 } from "lucide-react";

export function StockPortfolio({
  stocks,
  currentPrices,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
  isLoading,
  isPending,
  error, // Receive error state as a prop
}: StockPortfolioProps) {
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showModal, setShowModal] = useState(false);

  const COLORS = useMemo(() => {
    return Array.from(
      { length: stocks.length },
      (_, i) => `hsl(${i * 50}, 40%, 50%)`
    );
  }, [stocks.length]);

  const handleAddStock = async (
    stock: Omit<Stock, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await onAddStock(stock);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (stock: Stock) => {
    try {
      await onUpdateStock(stock);
      setShowModal(false);
      setEditingStock(null);
    } catch (error) {
      console.error("Error updating stock:", error);
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
        isPending={isPending} // Pass isPending for the modal to handle loading state
      />
    );
  };
  if (isLoading || isPending) {
    return (
      <div className="flex items-center flex-col justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg font-medium text-gray-800 mt-4">
          {isPending ? "Updating..." : "Loading your stock data..."}
        </p>
      </div>
    );
  }

  if (!isPending && !isLoading && stocks.length === 0) {
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
        {!isPending && stocks.length > 0 && (
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
          onEditStock={(stock) => {
            setEditingStock(stock);
            setShowModal(true);
          }}
          onDeleteStock={onDeleteStock}
          isLoading={isLoading}
        />
        {renderModal()}
      </CardContent>
    </Card>
  );
}
