"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockChart from "./stock-line-chart";
import { StockPieChart } from "./stock-pie-chart";



export function Dashboard() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Here you would typically call an API to get the AI response
      // For now, we'll just simulate an AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "AI response placeholder", sender: "ai" },
        ]);
      }, 1000);
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
          <StockPieChart />
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
