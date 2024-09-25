import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeContextProvider from "@/context/theme-switch";

// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
// import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/session-provider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NavMenu from "@/components/nav-menu";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-[82rem] mx-auto`}
          >
            <header className="flex items-center justify-between px-12 py-4 w-full flex-col md:flex-row">
              <div className="flex-1 flex justify-start items-center">
                <h1 className="text-lg md:text-xl font-bold">
                  {session?.user?.name ? `${session.user.name}'s ` : ""}
                  Stock Market Dashboard
                </h1>
              </div>
              <div className="flex-shrink-0 flex justify-center items-center">
                <NavMenu />
              </div>
            </header>
            <main className="mx-auto max-w-5xl text-2xl flex gap-2">
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </ThemeContextProvider>
  );
}
