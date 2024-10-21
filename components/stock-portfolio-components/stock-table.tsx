import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMobile } from "../../hooks/use-mobile";
import { SortOrder } from "@/types/stock";
import { useStock } from "@/context/stock-context";
import { StockRow } from "@/components/stock-portfolio-components/stock-row";
import { useState, useMemo } from "react";
import { clsx } from "clsx";

export function StockTable() {
  const { stocks, isPending } = useStock();

  const isMobile = useIsMobile();
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      return sortOrder === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    });
  }, [stocks, sortOrder]);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
   
    <Card className= "w-full">
      <CardHeader>
        <CardTitle>Stock Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className={clsx(
        "transition-all duration-500 ease-in-out",
        isPending ? "opacity-50 scale-95" : "opacity-100 scale-100"
      )}>
          <TableHeader className="dark:bg-slate-950/50 bg-slate-200/50">
            <TableRow>
              <TableHead
                className="text-center cursor-pointer"
                onClick={handleSort}
              >
                Symbol{" "}
                {sortOrder === "asc" ? (
                  <ChevronUp className="h-4 w-4 inline-block ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 inline-block ml-1" />
                )}
              </TableHead>
              {!isMobile && (
                <>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">
                    Avg Purchase Price
                  </TableHead>
                  <TableHead className="text-center">Current Price</TableHead>
                  <TableHead className="text-center">Daily Change</TableHead>
                  <TableHead className="text-center">Total Value</TableHead>
                  <TableHead className="text-center">Total Gains</TableHead>
                </>
              )}
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStocks.map((stock) => (
              <StockRow key={stock.id} stock={stock} isMobile={isMobile} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
