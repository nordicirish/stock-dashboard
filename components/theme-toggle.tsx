"use client";
import { useTheme } from "@/context/theme-switch";
import React from "react";
import { Moon, Sun } from "lucide-react";


export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      title="Toggle theme"
      type="button"
      aria-label="Toggle the current theme"
      className="bg-zinc-100/40 min-w-[2rem] min-h-[2rem] backdrop-blur-[0.5rem] ring-2
   border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.10] transition-all dark:bg-gray-950/40"
      onClick={toggleTheme}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </button>
  );
}
