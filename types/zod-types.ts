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

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        acceptTerms?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};
