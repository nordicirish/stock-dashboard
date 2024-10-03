import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stock } from "@/types/stock";
import { TrendIcon } from "@/components/trend-icon";
import { useTheme } from "next-themes";
import {
  formatCurrency,
  calculateTotalPortfolioValue,
  calculateTotalPortfolioGain,
  getTrend,
  getTrendColorClass,
} from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRefreshEffect } from "@/hooks/use-refresh-effect";
import { clsx } from "clsx";

interface PortfolioSummaryProps {
  stocks: Stock[];
  handleOpenModal: () => void;
  isPending: boolean;
  isLoading: boolean;
  currentPrices: Record<string, { price: number; percentChange: number }>;
}

export function PortfolioSummary({
  stocks,
  currentPrices,
  isPending,
  handleOpenModal,
}: PortfolioSummaryProps) {
  const { theme } = useTheme();

  const { totalValue, totalGain, totalGainPercent, trend, trendColorClass } =
    useMemo(() => {
      const totalValue = calculateTotalPortfolioValue(stocks, currentPrices);
      const totalGain = calculateTotalPortfolioGain(stocks, currentPrices);
      const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;
      const trend = getTrend(totalGain);
      const trendColorClass = getTrendColorClass(trend, theme || "light");

      return {
        totalValue,
        totalGain,
        totalGainPercent,
        trend,
        trendColorClass,
      };
    }, [stocks, currentPrices, theme]);

  const totalValueRef = useRefreshEffect<HTMLParagraphElement>(totalValue);
  const totalGainRef = useRefreshEffect<HTMLDivElement>(totalGain);

  return (
    <Card
      className={clsx(
        "mb-6 transition-all duration-500 ease-in-out",
        isPending ? "opacity-50 scale-95" : "opacity-100 scale-100"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          Stock Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-2">Total Value</h3>
          <p
            ref={totalValueRef}
            className="text-xl font-bold transition-all duration-300 ease-in-out"
          >
            {formatCurrency(totalValue)}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-2">Total Gain/Loss</h3>
          <div
            ref={totalGainRef}
            className={`text-xl items-center justify-center font-bold transition-all duration-300 ease-in-out ${trendColorClass}`}
          >
            <TrendIcon trend={trend} />
            {formatCurrency(Math.abs(totalGain))}
            <div className="text-center mt-2">
              <p>({totalGainPercent.toFixed(2)}%)</p>
            </div>
          </div>
        </div>
        {!isPending && stocks.length > 0 && (
          <Button
            onClick={handleOpenModal}
            variant="default"
            className="flex w-full items-center justify-center bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Stock
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
