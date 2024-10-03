import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { Stock } from "@/types/stock";
import { StockPieChart } from "./stock-pie-chart";
import { StockTable } from "./stock-table";
import { StockFormModal } from "./stock-form-modal";
import { PortfolioSummary } from "./stock-portfolio-summary";
import { StockPortfolioProps } from "@/types/stock";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
export function StockPortfolio({
  stocks,
  currentPrices,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
  isLoading,
  isPending,
  error,
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
        isPending={isPending}
      />
    );
  };

  // Don't render the component if the data isn't ready
  if (isLoading && !isPending) {
    return (
      <Card className="mb-6 min-h-[30rem]">
        <CardHeader>
          <CardTitle>Loading Your Portfolio...</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner message="Loading..." size={24} height="400px" />
        </CardContent>
      </Card>
    );
  }
  if (stocks.length === 0) {
    return (
      <Card className="mb-6 min-h-40">
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
    <Card className="mb-6 min-h-96">
      <CardHeader className="flex flex-row items-center justify-between"></CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="md:w-2/3 md:mb-6">
            <StockPieChart
              stocks={stocks}
              currentPrices={currentPrices}
              COLORS={COLORS}
              isPending={isPending}
              isLoading={isLoading}
            />
          </div>
          <div className="md:w-1/3 flex flex-col">
            <PortfolioSummary
              stocks={stocks}
              currentPrices={currentPrices}
              handleOpenModal={handleOpenModal}
              isPending={isPending}
              isLoading={isLoading}
            />
            {renderModal()}
          </div>
        </div>

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
