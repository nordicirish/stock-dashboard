"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockChart from "./stock-line-chart";
import { StockPieChart } from "./stock-pie-chart";
import { Stock } from "@/types/stock";
import { getStocks, updateStock, deleteStock, addStock } from "@/app/actions";

// Remove this type as it's no longer needed
// export type StockWithId = Omit<Stock, 'id'> & { id: string };

export function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const userId = "testuser123"; // Replace with actual user ID logic

  const fetchStocks = useCallback(async () => {
    try {
      const fetchedStocks = await getStocks(userId);
      setStocks(fetchedStocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      const addedStock = await addStock(userId, newStock);
      setStocks((prevStocks) => [...prevStocks, addedStock]);
      await fetchStocks(); // Refetch all stocks to ensure consistency
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (updatedStock: Stock) => {
    try {
      const updatedStockFromServer = await updateStock(userId, updatedStock);
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.id === updatedStockFromServer.id
            ? updatedStockFromServer
            : stock
        )
      );
      await fetchStocks(); // Refetch all stocks to ensure consistency
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    try {
      await deleteStock(userId, stockId);
      setStocks((prevStocks) =>
        prevStocks.filter((stock) => stock.id !== stockId)
      );
      await fetchStocks(); // Refetch all stocks to ensure consistency
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input.trim() }]);
      setInput("");
      // TODO: Add AI response logic here
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <h1 className="text-lg font-bold">AI Dashboard</h1>
      </header>
      <main className="flex-1 p-4 lg:p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <StockChart />
          <StockPieChart
            key={stocks.length} // Add this line
            stocks={stocks}
            onAddStock={handleAddStock}
            onUpdateStock={handleUpdateStock}
            onDeleteStock={handleDeleteStock}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chat with AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[200px] overflow-y-auto space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    } max-w-[80%] w-fit`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend}>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
