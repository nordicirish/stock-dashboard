import { useState } from "react";
import { Stock, StockListing } from "@/types/stock";
import { StockSearch } from "./stock-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStock, updateStock } from "@/app/actions";

interface AddStockFormProps {
  onAddStock: (stock: Stock) => void;
  existingStock?: Stock;
}

export function AddStockForm({ onAddStock, existingStock }: AddStockFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(
    existingStock ? { symbol: existingStock.symbol, name: existingStock.name, exchange: existingStock.exchange || "" } : null
  );
  const [quantity, setQuantity] = useState(existingStock ? existingStock.quantity.toString() : "");
  const [avgPrice, setAvgPrice] = useState(existingStock ? existingStock.avgPrice.toString() : "");
  const [userId, setUserId] = useState("testuser123");

  const resetForm = () => {
    setSelectedStock(null);
    setQuantity("");
    setAvgPrice("");
    setIsEditing(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    handleSubmit();
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called. IsEditing:", isEditing, "ExistingStock:", existingStock);
    if (selectedStock && quantity && avgPrice) {
      try {
        const stockData = {
          userId,
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          quantity: parseFloat(quantity),
          avgPrice: parseFloat(avgPrice)
        };

        console.log("Submitting stock data:", stockData);

        if (existingStock) {
          console.log("Updating existing stock");
          const updatedStock = await updateStock(userId, stockData);
          console.log("Stock updated successfully:", updatedStock);
          onAddStock(updatedStock);
        } else {
          console.log("Adding new stock");
          const newStock = await addStock(userId, stockData);
          console.log("Stock added successfully:", newStock);
          onAddStock(newStock);
        }

        resetForm();
      } catch (error) {
        console.error("Error adding/updating stock:", error);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const handleUpdateClick = () => {
    console.log("Update button clicked");
    setIsEditing(true);
  };

  if (existingStock && !isEditing) {
    return (
      <div className="space-y-2">
        <p>Quantity: {existingStock.quantity}</p>
        <p>Average Price: ${existingStock.avgPrice.toFixed(2)}</p>
        <Button onClick={handleUpdateClick} className="w-full">Update Stock</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {!existingStock && (
        <>
          <Input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <StockSearch 
            onStockSelect={setSelectedStock} 
            placeholder="Select a stock" 
            selectedStock={selectedStock}
          />
        </>
      )}
      <Input
        type="number"
        step="0.01"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Average price per share"
        value={avgPrice}
        onChange={(e) => setAvgPrice(e.target.value)}
        required
      />
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {existingStock ? "Update Stock" : "Add Stock"}
        </Button>
        {existingStock && (
          <Button type="button" onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
        )}
      </div>
    </form>
  );
}