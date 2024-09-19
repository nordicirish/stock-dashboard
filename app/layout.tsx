import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeContextProvider, { useTheme } from "@/context/theme-switch";
import ThemeToggle from "@/components/theme-toggle";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sidebarOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <ThemeContextProvider>
      <ClerkProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-[82rem] mx-auto`}
          >
            <SignedIn>
              <SidebarLayout defaultOpen={sidebarOpen}>
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                  <header className="flex items-center justify-between p-4 w-full">
                    <div className="flex-shrink-0">
                      <SidebarTrigger />
                    </div>
                    <div className="flex-grow flex justify-center items-center">
                      <h1 className="text-xl font-bold">
                        Stock Market Dashboard
                      </h1>
                      <span className="ml-4 flex space-x-2  rounded-md ">
                        <UserButton
                          showName
                          appearance={{
                            elements: {
                              userButtonBox:
                                "bg-green-200 hover:bg-green-400 text-sm dark:bg-green-800 dark:hover:bg-green-700 dark:text-white p-2 rounded-md"
                                                          
                              ,
                            },
                          }}
                        />
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <ThemeToggle />
                    </div>
                  </header>
                  <main className="flex-1 p-4">{children}</main>
                </div>
              </SidebarLayout>
            </SignedIn>
            <SignedOut>
              <header className="flex items-center justify-center p-4 w-full">
                <h1 className="text-xl font-bold">
                  Stock Market Dashboard
                </h1>
              </header>
              <main className="flex-1 p-4">{children}</main>
            </SignedOut>
          </body>
        </html>
      </ClerkProvider>
    </ThemeContextProvider>
  );
}
