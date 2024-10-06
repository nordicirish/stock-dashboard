import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
// destructure handlers to get an post
export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString();
      }
      if (url === `${baseUrl}/api/auth/signin`) {
        return `${baseUrl}/dashboard`; // Redirect to /dashboard after login
      }
      if (url === `${baseUrl}/api/auth/signout`) {
        return `${baseUrl}/api/auth/signin`; // Redirect to /api/auth/signin after logout
      }
      return baseUrl;
      
    },
  },
});
