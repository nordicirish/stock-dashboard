"use client";

import { useState } from "react";
import Link from "next/link";
import * as z from "zod";
import { registerUser } from "@/app/actions/user-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { TermsModal } from "./terms-modal";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const signUpSchema = z
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

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [formData, setFormData] = useState<SignUpValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpValues, string>>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof SignUpValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0] as keyof SignUpValues] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.", {
        duration: 3000,
      });
      return;
    }
    setIsLoading(true);

    try {
      const result = await registerUser(formData);

      if (result.success) {
        toast.success("Account created successfully!", {
          duration: 3000,
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
        });
        setErrors({});
      } else {
        if (result.error === "User with this email already exists") {
          setErrors({ email: result.error });
        } else {
          toast.error(
            result.error || "Error creating account, please try again",
            {
              duration: 3000,
            }
          );
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    acceptTerms: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                I accept the{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setShowTerms(true)}
                >
                  terms and conditions
                </button>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500">{errors.acceptTerms}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGitHubSignUp}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              Sign up with GitHub
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
