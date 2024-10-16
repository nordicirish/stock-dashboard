"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";

const links = [
  { name: "Home", hash: "/" },
  { name: "Dashboard", hash: "/dashboard" },
];

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const { data: session } = useSession();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Check if the user is on the sign-in or sign-up page so Sign In button doesn't show
  const isAuthPage =
    pathName.startsWith("/auth/signin") || pathName.startsWith("/auth/signup");

 
  console.log("PathName:", pathName);
  console.log("isAuthPage:", isAuthPage);

  return (
    <nav className="w-full h-[4rem] border-b border-opacity-40 bg-zinc-100/60 dark:bg-zinc-950/60 shadow-light-mode md: rounded-md dark:shadow-dark-mode flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-800 hover:text-gray-950 dark:text-gray-200 dark:hover:text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-white/90 dark:bg-gray-950/90 pt-16 rounded-sm"
          >
            <div className="absolute top-4 left-4">
              <ThemeToggle />
            </div>
            <nav className="flex flex-col space-y-4">
              {session &&
                links.map((link) => (
                  <NavLink
                    key={link.hash}
                    {...link}
                    onClick={handleLinkClick}
                    isActive={pathName === link.hash}
                    isMobile
                  />
                ))}
              {session ? (
                <Button
                  onClick={() => signOut()}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 h-10 rounded-lg shadow-md"
                >
                  Sign Out
                </Button>
              ) : (
                !isAuthPage && (
                  <Button
                    onClick={() => signIn()}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-300 h-10 rounded-lg shadow-md"
                  >
                    Sign In
                  </Button>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Page title - centered in mobile, left-aligned in desktop */}
      <div className="flex-1 flex justify-center md:justify-start">
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-green-500 to-purple-600 dark:from-blue-400 dark:via-green-400 dark:to-purple-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(100%-5rem)] md:max-w-none md:ml-6 md:mr-2">
          {session?.user?.name ? `${session.user.name}'s ` : ""}Stock Dashboard
        </h1>
      </div>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500">
        {session &&
          links.map((link) => (
            <li key={link.hash} className="h-10 flex items-center">
              <NavLink
                {...link}
                onClick={handleLinkClick}
                isActive={pathName === link.hash}
              />
            </li>
          ))}
        <li className="h-10 flex items-center">
          {session ? (
            <Button
              onClick={() => signOut()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 h-full px-4 rounded-lg shadow-md"
            >
              Sign Out
            </Button>
          ) : (
            !isAuthPage && (
              <Button
                onClick={() => signIn()}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-300 h-full px-4 rounded-lg shadow-md"
              >
                Sign In
              </Button>
            )
          )}
        </li>
        <li className="h-10 flex items-center">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}

const NavLink: React.FC<{
  name: string;
  hash: string;
  onClick: () => void;
  isActive: boolean;
  isMobile?: boolean;
}> = ({ name, hash, onClick, isActive, isMobile = false }) => (
  <Link
    href={hash}
    className={clsx(
      "flex items-center justify-center px-3 py-2 transition-all relative h-full text-base rounded-lg",
      isActive
        ? "text-white dark:text-gray-100 bg-gradient-to-r from-green-500 to-cyan-500 shadow-md"
        : "text-gray-800 dark:text-gray-200 bg-gradient-to-r from-transparent to-transparent hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600",
      "hover:text-gray-900 dark:hover:text-white",
      isMobile ? "w-full" : ""
    )}
    onClick={onClick}
  >
    {name}
  </Link>
);
