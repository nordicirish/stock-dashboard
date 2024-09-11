import { useState, useEffect } from 'react';
import { AddStockForm } from './add-stock-form';
import { StockPieChart } from './stock-pie-chart'; // Assuming you have this component
import { getStocks, updateStock, deleteStock } from '@/app/actions';
import { Stock } from '@/types/stock';
import { Button } from '@/components/ui/button';

export function StockPortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const userId = "testuser123"; // Replace with actual user ID logic

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const fetchedStocks = await getStocks(userId);
      setStocks(fetchedStocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const handleAddStock = async (newStock: Stock) => {
    setStocks(prevStocks => [...prevStocks, newStock]);
    await fetchStocks(); // Refresh the stocks after adding
  };

  const handleUpdateStock = async (updatedStock: Stock) => {
    try {
      await updateStock(userId, updatedStock);
      await fetchStocks(); // Refresh the stocks after updating
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (symbol: string) => {
    try {
      await deleteStock(userId, symbol);
      await fetchStocks(); // Refresh the stocks after deleting
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <div>
      <AddStockForm onAddStock={handleAddStock} />
      {stocks.length > 0 && (
        <StockPieChart
          stocks={stocks}
          onAddStock={handleAddStock}
          onUpdateStock={handleUpdateStock}
          onDeleteStock={handleDeleteStock}
        />
      )}
      <div>
        {stocks.map((stock) => (
          <div key={stock.symbol}>
            {stock.symbol} - {stock.quantity} shares
            <Button onClick={() => handleUpdateStock(stock)}>Update</Button>
            <Button onClick={() => handleDeleteStock(stock.symbol)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}