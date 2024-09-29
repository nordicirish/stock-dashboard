import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("Token:", token);
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      console.log("Updated Token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session:", session);
      console.log("Token:", token);
      session.user.id = token.id;
      return session;
    },
  },
  logger: {
    error: (code: string, metadata: any) => {
      console.error(code, metadata);
    },
    warn: (code: string) => {
      console.warn(code);
    },
    debug: (code: string, metadata: any) => {
      console.log(code, metadata);
    },
  },
};
