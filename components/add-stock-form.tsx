import { useState } from "react";
import { Stock, StockListing } from "@/types/stock";
import { StockSearch } from "./stock-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStock } from "@/app/actions";

interface AddStockFormProps {
  onAddStock: (stock: Stock) => void;
}

export function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(null);
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [userId, setUserId] = useState("testuser123"); // Manual user ID for testing

  const resetForm = () => {
    setSelectedStock(null);
    setQuantity("");
    setAvgPrice("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStock && quantity && avgPrice) {
      try {
        const newStock = {
          userId,
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          quantity: parseFloat(quantity),
          avgPrice: parseFloat(avgPrice)
        };
        await addStock(userId, newStock);
        console.log("Stock added successfully");
        onAddStock(newStock); // Call the prop function to update parent state
        resetForm();
      } catch (error) {
        console.error("Error adding stock:", error);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        selectedStock={selectedStock} // Pass the selected stock to StockSearch
      />
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
      <Button type="submit">Add Stock</Button>
    </form>
  );
}