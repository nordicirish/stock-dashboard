// components/stock-info.tsx
"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getStockAnalysis, getSP500Analysis } from "@/app/actions/openai-actions";
import { useStock } from "@/app/context/stock-context";


async function getLatestNews(
  symbol: string
): Promise<{ title: string; url: string }[]> {
  return [
    { title: `Latest news about ${symbol}`, url: "#" },
    { title: `${symbol} stock performance update`, url: "#" },
    { title: `Analyst recommendations for ${symbol}`, url: "#" },
  ];
}

export default function AiStockNews() {
  const { selectedStock } = useStock();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [latestNews, setLatestNews] = useState<
    { title: string; url: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [sp500Analysis, sp500News] = await Promise.all([
          getSP500Analysis(),
          getLatestNews("S&P 500"),
        ]);
        setAiAnalysis(sp500Analysis);
        setLatestNews(sp500News);
      } catch (error) {
        console.error("Error fetching S&P 500 data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      setIsLoading(true);
      Promise.all([
        getStockAnalysis(selectedStock.symbol),
        getLatestNews(selectedStock.symbol),
      ])
        .then(([analysis, news]) => {
          setAiAnalysis(analysis);
          setLatestNews(news);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching stock info:", error);
          setIsLoading(false);
        });
    }
  }, [selectedStock]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedStock
              ? `${selectedStock.symbol} - ${selectedStock.name}`
              : "S&P 500 Index"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">{aiAnalysis}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Latest News</h3>
                <ul className="space-y-2">
                  {latestNews.map((news, index) => (
                    <li key={index}>
                      <a
                        href={news.url}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {news.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
