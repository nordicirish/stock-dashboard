"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockLineChart from "./stock-line-chart";
import { StockPortfolio } from "./stock-portfolio";
import { Stock } from "@/types/stock";
import {
  getStocks,
  updateStock,
  deleteStock,
  addStock,
  getCurrentPrices,
} from "@/app/actions";

// Remove this type as it's no longer needed
// export type StockWithId = Omit<Stock, 'id'> & { id: string };

export function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, { price: number; percentChange: number }>
  >({});
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const userId = "testuser123"; // Replace with actual user ID logic

  const fetchStocks = useCallback(async () => {
    try {
      const fetchedStocks = await getStocks(userId);
      setStocks(fetchedStocks);
      return fetchedStocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  }, [userId]);

  const fetchCurrentPrices = useCallback(async (stocksToFetch: Stock[]) => {
    try {
      const symbols = stocksToFetch.map((stock) => stock.symbol);
      const prices = await getCurrentPrices(symbols);
      setCurrentPrices(prices);
    } catch (error) {
      console.error("Error fetching current prices:", error);
    }
  }, []);

  const refreshData = useCallback(async () => {
    const fetchedStocks = await fetchStocks();
    if (fetchedStocks) {
      await fetchCurrentPrices(fetchedStocks);
    }
  }, [fetchStocks, fetchCurrentPrices]);

  useEffect(() => {
    refreshData();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000); // Refresh every 60 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshData]);

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      const addedStock = await addStock(userId, newStock);
      console.log("Added stock:", addedStock);
      await refreshData();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (updatedStock: Stock) => {
    try {
      await updateStock(userId, updatedStock);
      await refreshData();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    try {
      await deleteStock(userId, stockId);
      await refreshData();
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
        <div className="grid gap-4 md:grid-cols-1 ">
          <StockPortfolio
            stocks={stocks}
            currentPrices={currentPrices}
            onAddStock={handleAddStock}
            onUpdateStock={handleUpdateStock}
            onDeleteStock={handleDeleteStock}
          />
          <div className="w-full flex flex-col sm:flex-row gap-6 mt-2">
            <StockLineChart />
            <Card className="w-full sm:w-1/2">
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
          </div>
        </div>
      </main>
    </div>
  );
}
