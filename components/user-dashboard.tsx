"use client";

import { useSession } from "next-auth/react";
import StockLineChart from "./stock-line-chart-components/stock-line-chart";
import { StockPortfolio } from "./stock-portfolio-components/stock-portfolio";
import AiStockNews from "@/components/ai-stock-news";
import { StockProvider } from "@/context/stock-context";

export default function UserDashboard() {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-20 ">
        <p className="text-lg font-medium dark:text-gray-100 text-gray-600">
          Please sign in to view your stock portfolio.
        </p>
      </div>
    );
  }

  return (
    <StockProvider>
      <div className="flex-1 p-0 sm:p-4 w-full">
        <StockPortfolio />
        <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
          <div className="w-full md:w-1/2">
            <StockLineChart />
          </div>
          <div className="w-full md:w-1/2 h-full">
            <AiStockNews />
          </div>
        </div>
      </div>
    </StockProvider>
  );
}
