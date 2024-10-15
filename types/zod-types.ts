import { z } from "zod";

export const StockFormSchema = z.object({
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

export type StockFormData = z.infer<typeof StockFormSchema>;

export const SignupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupValues = z.infer<typeof SignupSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password field must not be empty." }),
});

export const FormStateSchema = z.object({
  errors: z
    .object({
      name: z.array(z.string()).optional(),
      email: z.array(z.string()).optional(),
      password: z.array(z.string()).optional(),
      confirmPassword: z.array(z.string()).optional(),
      acceptTerms: z.array(z.string()).optional(),
    })
    .optional(),
  message: z.string().optional(),
  success: z.boolean().optional(),
  userId: z.string().optional(),
});

export type FormState = z.infer<typeof FormStateSchema>;

export const SessionPayloadSchema = z.object({
  userId: z.union([z.string(), z.number()]),
  expiresAt: z.date(),
});

export type SessionPayload = z.infer<typeof SessionPayloadSchema>;