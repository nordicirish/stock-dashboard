"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { signIn } from "@/auth";
import { createSession } from "./session-actions";
import { FormState, SignupSchema, LoginFormSchema } from "@/types/zod-types";
import { cookies } from "next/headers";

export async function registerUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptTerms: formData.get("acceptTerms") === "on",
  });


  // If any form fields are invalid, return early
   if (!validatedFields.success) {
     return {
       errors: validatedFields.error.flatten().fieldErrors,
       message: "Please correct the errors above.",
       success: false,
     };
   }

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;

  try {
    // 3. Check if the user's email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return {
        errors: { email: ["Email already exists"] },
        message: "Email already exists, please use a different email.",
        success: false,
      };
    }

    // Hash the user's password
    const hashedPassword = await hash(password, 12);

    // 4. Insert the user into the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        image: null,
      },
    });

    if (!user) {
      return {
        message: "An error occurred while creating your account.",
        success: false,
      };
    }

    // 5. Sign in the user
    const signInResult = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (signInResult?.error) {
      console.error("Error signing in after registration:", signInResult.error);
      return {
        message:
          "Account created, but failed to sign in. Please try logging in.",
        success: false,
      };
    }

    // 6. Create a session for the user
    const session = await createSession(user.id);

    // 7. Set the session cookie
    cookies().set("session", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return {
      message: "Account created successfully. You are now logged in.",
      success: true,
    };
  } catch (error) {
    console.error("Error in registerUser:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
    };
  }
}


export async function signInUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return {
        message: "Invalid email or password. Please try again.",
        success: false,
      };
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return {
        message: "Invalid email or password. Please try again.",
        success: false,
      };
    }

    const session = await createSession(user.id);

    cookies().set("session", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return {
      message: "Signed in successfully.",
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error("Error in signInUser:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
    };
  }
}
export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  return session.user.id;
}
