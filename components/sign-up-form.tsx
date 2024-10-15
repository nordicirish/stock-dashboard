"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
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
import { registerUser } from "@/app/actions/user-actions";
import { TermsModal } from "./ui/terms-modal";

export function SignUpForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await registerUser({}, formData);
      if (result?.success) {
        // Trigger a session update
        await signIn("credentials", {
          redirect: false,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });
        router.push("/dashboard");
      } else {
        setError(result?.message || "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleGitHubSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error signing up with GitHub:", error);
      setError("Failed to sign up with GitHub. Please try again.");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
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
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
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
      {pending ? "Signing Up..." : "Sign Up"}
    </Button>
  );
}
