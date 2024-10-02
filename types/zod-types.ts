import { z } from "zod";

export const stockFormSchema = z.object({
  symbol: z.string().min(1, "Stock symbol is required"),
  name: z.string().min(1, "Stock name is required"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
  avgPrice: z
    .number()
    .positive("Average price must be a positive number")
    // multiply by 100 to ensure it results in an integer, not more than two decimal places
    .refine((val) => Number.isInteger(val * 100), {
      message: "Price cannot have more than 2 decimal places",
    }),
});

export type StockFormData = z.infer<typeof stockFormSchema>;
