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

interface PortfolioSummaryProps {
  stocks: Stock[];
  handleOpenModal: () => void;
  isPending: boolean;
  currentPrices: Record<string, { price: number; percentChange: number }>;
}

export function PortfolioSummary({
  stocks,
  currentPrices,
  isPending,
  handleOpenModal,
}: PortfolioSummaryProps) {
  const { theme } = useTheme();
  const totalValue = calculateTotalPortfolioValue(stocks, currentPrices);
  const totalGain = calculateTotalPortfolioGain(stocks, currentPrices);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;
  const trend = getTrend(totalGain);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          Stock Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-2">Total Value</h3>
          <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-2">Total Gain/Loss</h3>
          <div
            className={`text-xl items-center justify-center font-bold ${getTrendColorClass(
              trend,
              theme || "light"
            )}`}
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
            className="flex w-full items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Stock
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
