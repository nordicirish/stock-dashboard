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
import { FaGithub } from "react-icons/fa";
import { signInUser } from "@/app/actions/user-actions";

export function SignInForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await signInUser({}, formData);
      if (result?.success) {
        // Trigger a session update
        await signIn("credentials", {
          redirect: false,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });
        router.push("/dashboard");
      } else {
        setError(result?.message || "Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleGitHubSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setError("Failed to sign in with GitHub. Please try again.");
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
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
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
          <SignInButton />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGitHubSignIn}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </form>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} type="submit" className="mt-2 w-full">
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}
