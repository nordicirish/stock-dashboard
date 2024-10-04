import type { Metadata } from "next";
import "./globals.css";
import ThemeContextProvider from "@/context/theme-switch";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/session-provider";
import { authOptions } from "./api/auth/[...nextauth]/options";
import NavMenu from "@/components/nav-menu";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
  const session = await getServerSession(authOptions);

  return (
    <ThemeContextProvider>
      <SessionProvider session={session}>
        <html lang="en" className={inter.className}>
          <body
            className="antialiased flex flex-col w-full min-h-screen pt-0 items-center justify-items-center max-w-[73rem] mx-auto bg-gradient-to-b from-blue-200 via-blue-300 to-gray-100 p-4
            dark:bg-gradient-to-b dark:from-indigo-800 dark:via-indigo-900 dark:to-indigo-950
             text-gray-900 dark:text-gray-100"
          >
            <header className="flex flex-col w-full h-full mt-4 mb-4">
              <NavMenu />
            </header>

            <main className="mx-auto w-full text-2xl flex gap-2 flex-col justify-center items-center h-full">
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </ThemeContextProvider>
  );
}
