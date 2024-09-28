"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

export default function NavMenu() {
  const pathName = usePathname();
  const { data: session } = useSession();
  const linkStyle =
    "py-1 px-2 text-gray-500 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-900 hover:scale-[1.15] active:scale-105 rounded-md transition-all";

  return (
    <nav className="flex justify-center items-center gap-4 mt-2 md:mt-0">
      {session && (
        <ul className="flex gap-4">
          <Link href="/">
            <li
              className={`${linkStyle} ${
                pathName === "/dashboard"
                  ? "bg-zinc-700 text-gray-100 dark:bg-zinc-900 dark:text-gray-100"
                  : ""
              }`}
            >
              Home
            </li>
          </Link>
          <Link href="/dashboard">
            <li
              className={`${linkStyle} ${
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
          className={`${linkStyle} bg-red-700 text-white hover:bg-red-800 active:bg-red-900`}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className={`${linkStyle} bg-green-700 text-white hover:bg-green-800 active:bg-green-900`}
        >
          Sign In
        </button>
      )}
      <ThemeToggle />
    </nav>
  );
}
