// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// import { Adapter } from "next-auth/adapters";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { verifyPassword } from "./lib/auth";

// const prisma = new PrismaClient();

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma) as Adapter,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID as string,
//       clientSecret: process.env.GOOGLE_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(
//         credentials: Record<"username" | "password", string> | undefined
//       ) {
//         if (!credentials) {
//           return null;
//         }
//         const user = await prisma.user.findUnique({
//           where: { email: credentials["username"] },
//         });
//         if (!user) {
//           return null;
//         }
//         const isValid = await verifyPassword(
//           credentials["password"],
//           user.password
//         );
//         if (!isValid) {
//           return null;
//         }
//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     session: async ({ session, user }) => {
//       if (session?.user) {
//         session.user.id = user.id;
//       }
//       return session;
//     },
//   },
// };

// export default NextAuth(authOptions);
