import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import ThemeContextProvider from "@/context/theme-switch";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/session-provider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NavMenu from "@/components/nav-menu";

export const metadata: Metadata = {
  title: "Stock Market Dashboard",
  description: "Track and manage your stock portfolio",
};

// need to async as awaiting promise from getServerSession
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = cookies();
  // const sidebarOpen = cookieStore.get("sidebar:state")?.value === "true";
  // // need to get session here to check if user is logged in
  const session = await getServerSession(authOptions);

  return (
    <ThemeContextProvider>
      <SessionProvider session={session}>
        <html lang="en">
          <Head>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />
          </Head>
          <body
            className="antialiased flex flex-col w-full min-h-screen justify-start items-center bg-gradient-to-b from-blue-200 via-blue-300 to-gray-100
            dark:bg-gradient-to-b dark:from-indigo-800 dark:via-indigo-900 dark:to-indigo-950 
             text-gray-900 dark:text-gray-100"
          >
            <header className="flex items-center justify-between px-12 py-4 w-full flex-col md:flex-row max-w-[72rem]">
              <div className="flex-1 flex justify-start items-center">
                <h1 className="text-lg md:text-xl font-bold">
                  {session?.user?.name ? `${session.user.name}'s ` : ""}
                  Stock Dashboard
                </h1>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <NavMenu />
              </div>
            </header>
            <main className="mx-auto w-full text-2xl flex gap-2  flex-col justify-center items-center h-full max-w-[72rem]">
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </ThemeContextProvider>
  );
}
