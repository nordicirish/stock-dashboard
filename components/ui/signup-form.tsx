"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";
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
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";
import { FormState } from "@/types/zod-types";
import { TermsModal } from "./terms-modal";

export function SignUpForm() {
  const router = useRouter();
  const [state, formAction] = useFormState<FormState, FormData>(
    registerUser,
    {}
  );
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (state && state.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  const handleGitHubSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
            {state?.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state?.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
            {state?.errors?.confirmPassword && (
              <p className="text-sm text-red-500">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="acceptTerms" name="acceptTerms" required />
            <Label htmlFor="acceptTerms">
              I accept the{" "}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => setShowTerms(true)}
              >
                terms and conditions
              </button>
            </Label>
          </div>
          {state?.errors?.acceptTerms && (
            <p className="text-sm text-red-500">{state.errors.acceptTerms}</p>
          )}

          <SignupButton />
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
        {state?.message && (
          <p
            className={`mt-4 text-sm ${
              state.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {state.message}
          </p>
        )}
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </Card>
  );
}

function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} type="submit" className="mt-2 w-full">
      {pending ? "Submitting..." : "Sign Up"}
    </Button>
  );
}
