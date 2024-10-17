import React, { useState, useCallback, useEffect } from "react";
import { parseInputValue } from "@/lib/utils";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockListing } from "@/types/stock";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronsUpDown,
  Search,
  DollarSign,
  Hash,
  Loader2,
} from "lucide-react";
import { searchStocks } from "@/app/actions/stock-actions";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StockFormSchema } from "@/types/zod-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStock } from "@/context/stock-context";

type StockFormData = z.infer<typeof StockFormSchema>;

export function StockFormModal() {
  const {
    selectedStock,
    handleAddStock,
    handleUpdateStock,
    isPending,
    isModalOpen,
    setIsModalOpen,
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
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stocks, setStocks] = useState<StockListing[]>([]);

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

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      searchStocks(value)
        .then((results) => {
          setStocks(results || []);
        })
        .catch((error) => {
          console.error("Error searching stocks:", error);
          setStocks([]);
        });
    } else {
      setStocks([]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = StockFormSchema.parse(formData);
      if (selectedStock) {
        handleUpdateStock({ ...validatedData, id: selectedStock.id });
      } else {
        handleAddStock(validatedData);
      }
      setIsModalOpen(false);
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

  useEffect(() => {
    // Validate all fields on mount and when selectedStock changes
    Object.keys(formData).forEach((key) => {
      validateField(
        key as keyof StockFormData,
        formData[key as keyof StockFormData]
      );
    });
  }, [selectedStock, validateField, formData]);

  useEffect(() => {
    if (selectedStock) {
      // Populate form with existing stock data for editing
      setFormData({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: selectedStock.quantity,
        avgPrice: selectedStock.avgPrice,
      });
    } else {
      // Clear form data when adding a new stock
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
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="stock-search"
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {formData.symbol
                            ? `${formData.symbol} - ${formData.name}`
                            : "Search stocks..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <div className="flex items-center border-b p-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            className="flex-grow bg-transparent outline-none"
                            placeholder="Search stocks..."
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {stocks.length > 0 ? (
                            <ul className="p-2">
                              {stocks.map((stock) => (
                                <li
                                  key={stock.symbol}
                                  className="cursor-pointer p-2 hover:bg-accent text-foreground"
                                  onClick={() => {
                                    handleInputChange("symbol", stock.symbol);
                                    handleInputChange("name", stock.name);
                                    setOpen(false);
                                  }}
                                >
                                  {stock.symbol} - {stock.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="p-2 text-center text-muted-foreground">
                              {searchValue
                                ? "No stocks found."
                                : "Start typing to search stocks."}
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
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
