"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getStockAnalysis } from "@/app/actions/openai-actions";
import { useStock } from "@/app/context/stock-context";
import { getLatestNews } from "@/app/actions/newsapi-actions"; // Import the server action

export default function AiStockNews() {
  const { selectedStock } = useStock(); // Use selected stock from context
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [latestNews, setLatestNews] = useState<
    { title: string; url: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStockData(stockSymbol: string) {
      try {
        setIsLoading(true);
        const [analysis, news] = await Promise.all([
          getStockAnalysis(stockSymbol), // Unified stock analysis function
          getLatestNews(stockSymbol), // Fetch latest news from the server action
        ]);
        setAiAnalysis(analysis);
        setLatestNews(news);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedStock) {
      fetchStockData(selectedStock.symbol);
    } else {
      fetchStockData(""); // Fetch default stock (S&P 500)
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
            <div className="flex justify-center items-center h-80">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                {/* space-y-2 adds some vertical spacing to children */}
                <div
                  className="text-sm text-muted-foreground space-y-2"
                  dangerouslySetInnerHTML={{ __html: aiAnalysis || "" }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Latest News</h3>
                <ul className="space-y-2 leading-3">
                  {latestNews.map((news, index) => (
                    <li key={index}>
                      <a
                        href={news.url}
                        className="text-sm  text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
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