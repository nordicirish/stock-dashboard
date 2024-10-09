"use server";
import { StockData, StockListing, YahooQuote, Stock } from "@/types/stock";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";

export async function registerUser(
  userData: Omit<User, "id" | "image" | "emailVerified">
) {
  const { name, email, password } = userData;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email ?? "" },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await hash(password ?? "", 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Set default values for fields not provided in the form
        emailVerified: null,
        image: null,
      },
    });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Failed to register user" };
  }
}

export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  return session.user.id;
}
// Fetch stock data from Yahoo Finance API
