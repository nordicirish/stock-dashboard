import { z } from "zod";

export const stockFormSchema = z.object({
  symbol: z.string().min(1, "Stock symbol is required"),
  name: z.string().min(1, "Stock name is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  avgPrice: z
    .number()
    .positive("Average price must be a positive number")
    .multipleOf(0.01, "Price must have at most 2 decimal places"),
});

export type StockFormData = z.infer<typeof stockFormSchema>;
