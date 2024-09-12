import { useState, useEffect } from 'react';
import { AddStockForm } from './add-stock-form';
import { StockPieChart } from './stock-pie-chart';
import { getStocks, updateStock, deleteStock } from '@/app/actions';
import { Stock } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { StockWithId } from '@/components/dashboard'; // Import StockWithId
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

export function StockPortfolio() {
  const [stocks, setStocks] = useState<StockWithId[]>([]); // Change to StockWithId[]
  const userId = "testuser123"; // Replace with actual user ID logic

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const fetchedStocks = await getStocks(userId);
      // Convert fetched stocks to StockWithId
      const stocksWithId = fetchedStocks.map(stock => ({
        ...stock,
        id: stock.id ? stock.id.toString() : uuidv4()
      }));
      setStocks(stocksWithId);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const handleAddStock = async (newStock: Omit<Stock, 'id'>) => {
    const stockWithId: StockWithId = {
      ...newStock,
      id: uuidv4()
    };
    setStocks(prevStocks => [...prevStocks, stockWithId]);
    await fetchStocks(); // Refresh the stocks after adding
  };

  const handleUpdateStock = async (updatedStock: StockWithId) => {
    try {
      const { id, ...stockWithoutId } = updatedStock;
      await updateStock(userId, { ...stockWithoutId, id: parseInt(id) });
      await fetchStocks(); // Refresh the stocks after updating
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    const stockToDelete = stocks.find(stock => stock.id === stockId);
    if (stockToDelete) {
      try {
        await deleteStock(userId, stockToDelete.symbol);
        await fetchStocks(); // Refresh the stocks after deleting
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
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
          <div key={stock.id}>
            {stock.symbol} - {stock.quantity} shares
            <Button onClick={() => handleUpdateStock(stock)}>Update</Button>
            <Button onClick={() => handleDeleteStock(stock.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}