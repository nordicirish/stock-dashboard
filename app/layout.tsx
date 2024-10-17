import type { Metadata } from "next";
import "./globals.css";
import ThemeContextProvider from "@/context/theme-switch";

import SessionProvider from "@/components/session-provider";
import { auth } from "@/auth";
import NavMenu from "@/components/nav-menu";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Market Dashboard",
  description: "Track and manage your stock portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // for session provider

  return (
    <ThemeContextProvider>
      <SessionProvider session={session}>
        <html lang="en" className={inter.className}>
          <body
            className="antialiased flex flex-col w-full min-h-screen pt-0 justify-center items-center justify-items-center mx-auto bg-gradient-to-b from-blue-200 via-blue-300 to-gray-100 p-4
            dark:bg-gradient-to-b dark:from-indigo-800 dark:via-indigo-900 dark:to-indigo-950
             text-gray-900 dark:text-gray-100"
          >
            <header className="flex flex-col w-full h-full mt-4 mb-4 max-w-[73rem]">
              <NavMenu />
            </header>

            <main className="mx-auto w-full max-w-[73rem] text-2xl flex gap-2 flex-col justify-center items-center h-full">
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </ThemeContextProvider>
  );
}
