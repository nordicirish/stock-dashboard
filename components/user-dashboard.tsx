"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockLineChart from "./stock-linechart-components/stock-line-chart";
import { StockPortfolio } from "./stock-portfolio-components/stock-portfolio";
import { Stock } from "@/types/stock";
import {
  getStocks,
  updateStock,
  deleteStock,
  addStock,
  getCurrentPrices,
} from "@/app/actions";
import { useUser } from "@clerk/nextjs";

export function UserDashboard() {
  const { user } = useUser();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentPrices, setCurrentPrices] = useState<
    Record<string, { price: number; percentChange: number }>
  >({});
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const fetchStocks = useCallback(async () => {
    try {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks);
      return fetchedStocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  }, []);

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
    if (user) {
      refreshData();
      const intervalId = setInterval(refreshData, 60000); // Refresh every 60 seconds
      return () => clearInterval(intervalId);
    }
  }, [refreshData, user]);

  const handleAddStock = async (newStock: Omit<Stock, "id">) => {
    try {
      await addStock(newStock);
      await refreshData();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const handleUpdateStock = async (updatedStock: Stock) => {
    try {
      await updateStock(updatedStock);
      await refreshData();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (stockId: number) => {
    try {
      await deleteStock(stockId);
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-600">
          Please sign in to view your stock portfolio.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-0 sm:p-4 space-y-4">
      <StockPortfolio
        stocks={stocks}
        currentPrices={currentPrices}
        onAddStock={handleAddStock}
        onUpdateStock={handleUpdateStock}
        onDeleteStock={handleDeleteStock}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <StockLineChart />
        <Card className="flex-1">
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
              <div className="flex gap-2">
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
    </main>
  );
}
