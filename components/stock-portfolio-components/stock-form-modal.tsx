import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Stock } from "@/types/stock";
import { StockForm } from "../stock-form";

interface StockFormModalProps {
  existingStock?: Stock;
  onSubmit: (stock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function StockFormModal({ existingStock, onSubmit, onCancel }: StockFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {existingStock ? `Edit Stock: ${existingStock.symbol}` : "Add New Stock"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <StockForm
            existingStock={existingStock}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}