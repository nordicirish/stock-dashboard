import { useState, useEffect } from "react";
import { Stock, StockListing } from "@/types/stock";
import { StockSearch } from "./stock-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStock, updateStock } from "@/app/actions";

interface StockFormProps {
  onSubmit: (stock: Omit<Stock, "id">) => void;
  existingStock?: Stock;
  onCancel?: () => void;
}

export function StockForm({ onSubmit, existingStock, onCancel }: StockFormProps) {
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(
    existingStock
      ? { symbol: existingStock.symbol, name: existingStock.name }
      : null
  );
  const [quantity, setQuantity] = useState(existingStock ? existingStock.quantity.toString() : "");
  const [avgPrice, setAvgPrice] = useState(existingStock ? existingStock.avgPrice.toString() : "");
  const [userId] = useState("testuser123");

  useEffect(() => {
    if (existingStock) {
      setSelectedStock({
        symbol: existingStock.symbol,
        name: existingStock.name,
      });
      setQuantity(existingStock.quantity.toString());
      setAvgPrice(existingStock.avgPrice.toString());
    }
  }, [existingStock]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStock && quantity && avgPrice) {
      const stockData: Omit<Stock, "id" | "createdAt" | "updatedAt"> = {
        userId,
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: parseFloat(quantity),
        avgPrice: parseFloat(avgPrice),
      };

      try {
        if (existingStock) {
          // Update existing stock
          const updated = await updateStock(userId, stockData);
          onSubmit(updated);
        } else {
          // Add new stock
          const added = await addStock(userId, stockData);
          onSubmit(added);
        }

        if (!existingStock) {
          setSelectedStock(null);
          setQuantity("");
          setAvgPrice("");
        }
      } catch (error) {
        console.error("Error submitting stock:", error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {!existingStock && (
        <StockSearch 
          onStockSelect={setSelectedStock} 
          placeholder="Select a stock" 
          selectedStock={selectedStock}
        />
      )}
      {existingStock && (
        <div className="font-semibold text-lg mb-2 text-foreground">
          {existingStock.name} ({existingStock.symbol})
        </div>
      )}
      <div className="flex items-center space-x-2">
        <label htmlFor="quantity" className="text-sm font-medium text-foreground w-24">
          Quantity
        </label>
        <Input
          id="quantity"
          type="number"
          step="0.01"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="flex-grow"
        />
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="avgPrice" className="text-sm font-medium text-foreground w-24">
          Avg Price
        </label>
        <Input
          id="avgPrice"
          type="number"
          step="0.01"
          placeholder="Average price per share"
          value={avgPrice}
          onChange={(e) => setAvgPrice(e.target.value)}
          required
          className="flex-grow"
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {existingStock ? "Update Stock" : "Add Stock"}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}