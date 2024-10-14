import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Stock, NewStock } from "@/types/stock";
import StockForm from "./stock-form";
import { Loader2 } from "lucide-react";

interface StockFormModalProps {
  existingStock: Stock | null;
  onSubmit: (stock: NewStock) => void;
  onCancel: () => void;
  isPending: boolean;
  isOpen: boolean;
}

export function StockFormModal({
  existingStock,
  onSubmit,
  onCancel,
  isPending,
  isOpen,
}: StockFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingStock
              ? `Edit Stock: ${existingStock.symbol}`
              : "Add New Stock"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        {isPending ? (
          <div className="flex justify-center items-center p-4">
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
      </DialogContent>
    </Dialog>
  );
}
