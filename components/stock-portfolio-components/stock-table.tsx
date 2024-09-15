import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Stock } from "@/types/stock";
import { useTheme } from "next-themes";

interface StockTableProps {
  stocks: Stock[];
  currentPrices: Record<string, number>;
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: number) => void;
}

export function StockTable({ stocks, currentPrices, onEdit, onDelete }: StockTableProps) {
  const { theme } = useTheme();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Symbol</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Avg Price</TableHead>
          <TableHead className="text-center">Current Price</TableHead>
          <TableHead className="text-center">Total Value</TableHead>
          <TableHead className="text-center">Daily Gain/Loss</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => {
          const currentPrice = currentPrices[stock.symbol] || stock.avgPrice;
          const totalValue = stock.quantity * currentPrice;
          const dailyGainLoss = (currentPrice - stock.avgPrice) * stock.quantity;
          const isGain = dailyGainLoss >= 0;
          const textColor = theme === 'dark' 
            ? (isGain ? 'text-green-400' : 'text-red-400')
            : (isGain ? 'text-green-600' : 'text-red-600');

          return (
            <TableRow key={stock.id} className="hover:bg-muted/50">
              <TableCell className="font-medium text-center">{stock.symbol}</TableCell>
              <TableCell className="text-center">{stock.quantity.toLocaleString()}</TableCell>
              <TableCell className="text-center">${stock.avgPrice.toFixed(2)}</TableCell>
              <TableCell className="text-center">${currentPrice.toFixed(2)}</TableCell>
              <TableCell className="text-center font-medium">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className={`text-center ${textColor}`}>
                <div className="flex items-center justify-center">
                  {isGain ? <TrendingUp className="inline mr-1 h-4 w-4" /> : <TrendingDown className="inline mr-1 h-4 w-4" />}
                  ${Math.abs(dailyGainLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button onClick={() => onEdit(stock)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => onDelete(stock.id!)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}