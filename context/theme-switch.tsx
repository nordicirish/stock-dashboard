"use client";
// allows theme value and toggletheme function to be accessed from any component

import React, { useEffect, useState, createContext, useContext } from "react";

type Theme = "light" | "dark";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      //save theme in local storage to persist theme
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      //add dark class to html element so tailwind can apply dark mode
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      //remove dark class from html element
    }
  };
  // check if theme is in local storage when page loads and set it
  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme") as Theme | null;
    // as Theme specifies the type and values of localTheme
    if (localTheme) {
      setTheme(localTheme);
      if (localTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    //if no value in local storage set theme using the machine preference for dark or light mode
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }

  return context;
}
