import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma"; // Import Prisma client
import { SessionPayload } from "next-auth";
const secretKey = process.env.NEXTAUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

// Encrypt JWT with session payload
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1hr")
    .sign(key);
}

// Decrypt and verify JWT
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

// Create a new session using Prisma
// Create a new session using Prisma
export async function createSession(userId: string) {
  // 1. Set the expiration date for the session (7 days)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 2. Create the session in the database using Prisma
  const session = await prisma.session.create({
    data: {
      userId: userId,
      expires: expires,
      sessionToken: await encrypt({ userId, expiresAt: expires }), // Assuming you want to store an encrypted token
    },
  });

  // 3. Store the sessionToken in cookies for optimistic auth checks
  cookies().set("session", session.sessionToken, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });

  return session;
}