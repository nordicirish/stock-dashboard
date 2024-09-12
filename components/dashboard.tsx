"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockChart from "./stock-line-chart";
import { StockPieChart } from "./stock-pie-chart";
import { Stock } from "@/types/stock";
import { v4 as uuidv4 } from "uuid";
import { getStocks, updateStock, deleteStock, addStock } from "@/app/actions";

// Update the StockWithId type
export type StockWithId = Omit<Stock, 'id'> & { id: string };

export function Dashboard() {
  const [stocks, setStocks] = useState<StockWithId[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const userId = "testuser123"; // Replace with actual user ID logic

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const fetchedStocks = await getStocks(userId);
      setStocks(
        fetchedStocks.map((stock) => ({
          ...stock,
          id: stock.id ? stock.id.toString() : uuidv4(),
        }))
      );
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      const addedStock = await addStock(userId, newStock);
      const stockWithId: StockWithId = {
        ...addedStock,
        id: addedStock.id ? addedStock.id.toString() : uuidv4(),
      };
      setStocks((prevStocks) => [...prevStocks, stockWithId]);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (updatedStock: StockWithId) => {
    try {
      const { id, ...stockWithoutId } = updatedStock;
      const updatedStockFromServer = await updateStock(userId, stockWithoutId);
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.id === id
            ? { ...updatedStockFromServer, id }
            : stock
        )
      );
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    const stockToDelete = stocks.find((stock) => stock.id === stockId);
    if (stockToDelete) {
      try {
        await deleteStock(userId, stockToDelete.symbol);
        setStocks((prevStocks) =>
          prevStocks.filter((stock) => stock.id !== stockId)
        );
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
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
