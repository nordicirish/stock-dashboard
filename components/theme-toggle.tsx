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
      className="bg-zinc-100 min-w-[2rem] min-h-[2rem] bg-opacity-80 backdrop-blur-[0.5rem]
   border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
      onClick={toggleTheme}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </button>
  );
}
