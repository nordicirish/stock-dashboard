import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import {
  Stock,
  NewStock,
  UpdateStock,
  StockPortfolioProps,
} from "@/types/stock";
import { StockPieChart } from "./stock-pie-chart";
import { StockTable } from "./stock-table";
import { StockFormModal } from "./stock-form-modal";
import { PortfolioSummary } from "./stock-portfolio-summary";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const COLORS = useMemo(() => {
    return Array.from(
      { length: stocks.length },
      (_, i) => `hsl(${i * 50}, 40%, 50%)`
    );
  }, [stocks.length]);

  const handleAddStock = async (stock: NewStock) => {
    try {
      await onAddStock(stock);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (stock: UpdateStock) => {
    try {
      await onUpdateStock(stock);
      setIsModalOpen(false);
      setEditingStock(null);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleOpenModal = () => {
    setEditingStock(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingStock(null);
    setIsModalOpen(false);
  };

  if (isLoading && stocks.length === 0) {
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

  return (
    <div className="mb-6 min-h-96">
      <div>
        {error && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}
        {stocks.length > 0 && (
          <>
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
              </div>
            </div>
            <StockTable
              stocks={stocks}
              currentPrices={currentPrices}
              onEditStock={(stock) => {
                setEditingStock(stock);
                setIsModalOpen(true);
              }}
              onDeleteStock={onDeleteStock}
              isLoading={isLoading}
            />
          </>
        )}

        <StockFormModal
          isOpen={isModalOpen}
          existingStock={editingStock}
          onSubmit={(stock) => {
            if (editingStock) {
              handleUpdateStock({ ...stock, id: editingStock.id });
            } else {
              handleAddStock(stock);
            }
          }}
          onCancel={handleCloseModal}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
