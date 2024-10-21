import React, { useState, useCallback, useEffect } from "react";
import { parseInputValue } from "@/lib/utils";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockListing, Stock } from "@/types/stock";
import { DollarSign, Hash, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StockFormSchema } from "@/types/zod-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useStock } from "@/context/stock-context";
import { StockSearchPopover } from "@/components/stock-search-popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type StockFormData = z.infer<typeof StockFormSchema>;

export function StockFormModal() {
  const {
    selectedStock,
    handleAddStock,
    handleUpdateStock,
    isPending,
    isModalOpen,
    setIsModalOpen,
    stocks,
  } = useStock();

  const [formData, setFormData] = useState<StockFormData>({
    symbol: selectedStock?.symbol || "",
    name: selectedStock?.name || "",
    quantity: selectedStock?.quantity || 0,
    avgPrice: selectedStock?.avgPrice || 0,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof StockFormData, string>>
  >({});
  const [showWarning, setShowWarning] = useState(false);
  const [existingStock, setExistingStock] = useState<Stock | null>(null);

  const validateField = useCallback(
    (field: keyof StockFormData, value: string | number) => {
      try {
        StockFormSchema.shape[field].parse(value);
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
        }
      }
    },
    []
  );

  const handleInputChange = useCallback(
    (field: keyof StockFormData, value: string) => {
      let parsedValue: string | number = value;
      if (field === "quantity") {
        parsedValue = parseInputValue(value, "int");
      } else if (field === "avgPrice") {
        parsedValue = parseInputValue(value, "float");
      }
      setFormData((prev) => ({ ...prev, [field]: parsedValue }));
      validateField(field, parsedValue);
    },
    [validateField]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = StockFormSchema.parse(formData);
      const existingStock = stocks.find(
        (stock) => stock.symbol === validatedData.symbol
      );

      if (existingStock && !selectedStock) {
        setShowWarning(true);
        setExistingStock(existingStock);
        return;
      }

      if (selectedStock) {
        handleUpdateStock({ ...validatedData, id: selectedStock.id });
      } else {
        handleAddStock(validatedData);
      }
      setIsModalOpen(false);
      setShowWarning(false);
      setExistingStock(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof StockFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof StockFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleStockSelect = (stock: StockListing) => {
    handleInputChange("symbol", stock.symbol);
    handleInputChange("name", stock.name);
  };

  const handleProceed = () => {
    if (existingStock) {
      const updatedStock = {
        id: existingStock.id, // Include the id
        symbol: existingStock.symbol,
        name: existingStock.name,
        quantity:  formData.quantity,
        avgPrice: formData.avgPrice,
          
      };
      handleUpdateStock(updatedStock);
      setIsModalOpen(false);
      setShowWarning(false);
      setExistingStock(null);
    }
  };

  useEffect(() => {
    if (selectedStock) {
      setFormData({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: selectedStock.quantity,
        avgPrice: selectedStock.avgPrice,
      });
    } else {
      setFormData({
        symbol: "",
        name: "",
        quantity: 0,
        avgPrice: 0,
      });
    }
  }, [selectedStock]);

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            {selectedStock
              ? `Edit Stock: ${selectedStock.symbol}`
              : "Add New Stock"}
          </DialogTitle>
        </DialogHeader>
        {isPending ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : showWarning ? (
          <Alert>
            <AlertTitle className="text-yellow-600">Warning</AlertTitle>
            <AlertDescription className="text-yellow-600">
              This stock already exists in your portfolio. Do you want to update
              the existing stock?
            </AlertDescription>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowWarning(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleProceed}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Proceed
              </Button>
            </DialogFooter>
          </Alert>
        ) : (
          <Card className="w-full max-w-md mx-auto">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stock-search">Stock</Label>
                  {selectedStock ? (
                    <div className="p-2 bg-secondary rounded-md">
                      {selectedStock.symbol} - {selectedStock.name}
                    </div>
                  ) : (
                    <StockSearchPopover
                      placeholder="Search stocks..."
                      onSelect={handleStockSelect}
                      selectedStock={
                        formData.symbol && formData.name
                          ? { symbol: formData.symbol, name: formData.name }
                          : null
                      }
                    />
                  )}
                  {errors.symbol && (
                    <p className="text-sm text-red-500">{errors.symbol}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                    {errors.quantity && (
                      <p className="text-sm text-red-500">{errors.quantity}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avgPrice">Average Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="avgPrice"
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        value={formData.avgPrice}
                        onChange={(e) =>
                          handleInputChange("avgPrice", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                    {errors.avgPrice && (
                      <p className="text-sm text-red-500">{errors.avgPrice}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isPending}
                  >
                    {isPending
                      ? "Loading..."
                      : selectedStock
                      ? "Update"
                      : "Add"}{" "}
                    Stock
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
