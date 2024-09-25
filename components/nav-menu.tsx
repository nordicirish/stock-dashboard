"use client";

// import {
//   BadgeCheck,
//   Bell,
//   ChevronsUpDown,
//   CreditCard,
//   LogOut,
// } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const ACTIVE_ROUTE = "py-1 px-2 text-gray-300 bg-gray-700";
const INACTIVE_ROUTE =
  "py-1 px-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name}
        <br />
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
}
export default function NavMenu() {
  const pathName = usePathname();
  const { data: session } = useSession();
  return (
    <div className="flex justify-center items-center gap-4 mt-2 md:mt-0">
      {session && (
        <ul className="flex gap-4">
          <Link href="/">
            <li
              className={`py-1 px-2 text-gray-500 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-zinc-700 dark:hover:bg-zinc-900 hover:scale-[1.15] active:scale-105 transition-all ${
                pathName === "/"
                  ? "bg-zinc-700 text-gray-100 dark:bg-zinc-900 dark:text-gray-100"
                  : ""
              }`}
            >
              Home
            </li>
          </Link>
          <Link href="/dashboard">
            <li
              className={`py-1 px-2 text-gray-500 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-900 hover:scale-[1.15] active:scale-105 transition-all ${
                pathName === "/dashboard"
                  ? "bg-zinc-700 text-gray-100 dark:bg-zinc-900 dark:text-gray-100"
                  : ""
              }`}
            >
              Dashboard
            </li>
          </Link>
        </ul>
      )}
      {session ? (
        <button
          // signOut() removes the cookie to end the session
          onClick={() => signOut()}
          className="py-1 px-2 text-gray-500 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-zinc-700 dark:hover:bg-zinc-900 hover:scale-[1.15] active:scale-105 transition-all"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="py-1 px-2 text-gray-500 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-900"
        >
          Sign In
        </button>
      )}
      <ThemeToggle />
    </div>
  );
}