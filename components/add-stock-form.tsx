import { useState } from "react";
import { Stock, StockListing } from "@/types/stock";
import { StockSearch } from "./stock-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddStockFormProps {
  onAddStock: (stock: Stock) => void;
}

export function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [selectedStock, setSelectedStock] = useState<StockListing | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStock && quantity && price) {
      onAddStock({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: parseInt(quantity),
        price: parseFloat(price)
      });
      setSelectedStock(null);
      setQuantity("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StockSearch onStockSelect={setSelectedStock} placeholder="Select a stock" />
      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Price per share"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <Button type="submit">Add Stock</Button>
    </form>
  );
}