import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Stock } from "@/types/stock";
import { StockForm } from "./stock-form";
import { Loader2 } from "lucide-react";

interface StockFormModalProps {
  existingStock?: Stock;
  onSubmit: (stock: Omit<Stock, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function StockFormModal({
  existingStock,
  onSubmit,
  onCancel,
  isPending,
}: StockFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {existingStock
              ? `Edit Stock: ${existingStock.symbol}`
              : "Add New Stock"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isPending ? ( // Check for isPending
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <StockForm
              existingStock={existingStock}
              onSubmit={onSubmit}
              onCancel={onCancel}
              isPending={isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
