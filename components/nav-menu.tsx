"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { clsx } from "clsx";
import { Menu, X } from "lucide-react";
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

  return (
    <nav className="w-full h-[4rem] border-b border-opacity-40 bg-white/90 dark:bg-gray-950/90 shadow-light-mode dark:shadow-dark-mode flex items-center justify-between px-4 md:px-0 md:justify-center md:items-center transition-all duration-300 ease-in-out">
      {/* Mobile menu and title */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-800 hover:text-gray-950 dark:text-gray-200 dark:hover:text-white focus:outline-none mr-6"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] bg-white/90 dark:bg-gray-950/70 pt-[5.5rem] rounded-sm custom-hide-close-btn"
          >
            <div className="absolute top-5 left-5 ">
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
                <Button
                  onClick={() => signIn()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-300 h-10 rounded-lg shadow-md"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Page title */}
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-green-500 to-purple-600 dark:from-blue-400 dark:via-green-400 dark:to-purple-400 md:ml-6 md:mr-2 md:flex-shrink-0">
          {session?.user?.name ? `${session.user.name}'s ` : ""}Stock Dashboard
        </h1>
      </div>

      {/* Desktop menu */}
      <ul className="hidden md:flex w-full flex-row items-center justify-end gap-4 text-sm font-medium text-gray-500 md:mr-6 md:ml-2 h-10">
        {session &&
          links.map((link) => (
            <li
              key={link.hash}
              className="relative transition-all h-full flex items-center"
            >
              <NavLink
                {...link}
                onClick={handleLinkClick}
                isActive={pathName === link.hash}
              />
            </li>
          ))}
        <li className="relative transition-all h-full flex items-center">
          {session ? (
            <Button
              onClick={() => signOut()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 h-full px-4 rounded-lg shadow-md"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              onClick={() => signIn()}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-300 h-full px-4 rounded-lg shadow-md"
            >
              Sign In
            </Button>
          )}
        </li>
        <li className="relative transition-all h-full flex items-center">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}

// Reusable NavLink component
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
      "flex items-center justify-center px-3 py-2 transition-all relative h-full text-base",
      isActive
        ? "text-white dark:text-gray-300 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg shadow-md"
        : "text-gray-800 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-300"
    )}
    onClick={onClick}
  >
    {name}
    {isActive && (
      <span
        className={clsx(
          "absolute inset-0 -z-10 bg-gradient-to-r from-green-500 to-cyan-500 shadow-md",
          isMobile ? "rounded-none" : "rounded-lg"
        )}
      />
    )}
  </Link>
);
