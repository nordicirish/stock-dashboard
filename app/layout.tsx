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
            className="antialiased flex flex-col w-full min-h-screen justify-start items-center bg-gradient-to-b from-blue-200 via-blue-300 to-gray-100
            dark:bg-gradient-to-b dark:from-indigo-800 dark:via-indigo-900 dark:to-indigo-950 
             text-gray-900 dark:text-gray-100"
          >
            <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-2 mt-2 mb-4 h-24 md:h-14 w-full max-w-[72rem] bg-zinc-100/90 dark:bg-zinc-900/70 rounded-md">
              <div className="w-full md:w-auto flex items-center justify-center md:justify-start h-full">
                <h1 className="text-lg md:text-xl font-bold">
                  {session?.user?.name ? `${session.user.name}'s ` : ""}
                  Stock Dashboard
                </h1>
              </div>
              <div className="w-full md:w-auto flex items-center justify-center md:justify-end h-full">
                <NavMenu />
              </div>
            </header>

            <main className="mx-auto w-full text-2xl flex gap-2 flex-col justify-center items-center h-full max-w-[72rem]">
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </ThemeContextProvider>
  );
}
