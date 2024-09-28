"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

export default function NavMenu() {
  const pathName = usePathname();
  const { data: session } = useSession();

  const linkStyle =
    "flex justify-center items-center gap-4 py-1 px-2 text-gray-900 dark:text-gray-300 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-900 hover:scale-[1.15] active:scale-105 rounded-md transition-all";

  const activeStyle =
    "bg-zinc-300 dark:bg-gray-900 text-gray-800 dark:text-gray-100";

  // Separate style for SignIn and SignOut buttons
  const buttonStyle =
    "flex justify-center items-center py-1 px-2 text-white rounded-md transition-all";

  return (
    <nav className="flex flex-1 justify-center items-center gap-4">
      {session && (
        <ul className="flex gap-4">
          <Link href="/" passHref>
            <li
              className={`${linkStyle} ${pathName === "/" ? activeStyle : ""}`}
            >
              Home
            </li>
          </Link>
          <Link href="/dashboard" passHref>
            <li
              className={`${linkStyle} ${
                pathName === "/dashboard" ? activeStyle : ""
              }`}
            >
              Dashboard
            </li>
          </Link>
        </ul>
      )}
      {session ? (
        <button
          onClick={() => signOut()}
          className={`${buttonStyle} bg-red-700 hover:bg-red-800 active:bg-red-900`}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className={`${buttonStyle} bg-green-700 hover:bg-green-800 active:bg-green-900`}
        >
          Sign In
        </button>
      )}
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </nav>
  );
}
