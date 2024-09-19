"use client"; // Client-side only

import ThemeContextProvider, { useTheme } from "@/context/theme-switch";

import { SignedIn, UserButton } from "@clerk/nextjs";

export default function SignedInWrapper() {
  const { theme } = useTheme(); // Now this hook works in the client component
  console.log("theme", theme);
  console.log("Theme:", theme);

  const appearanceVariables = {
    colorPrimary: theme === "light" ? "blue" : "darkblue",
    colorText: theme === "light" ? "black" : "white",
  };

  console.log("Appearance Variables:", appearanceVariables);

  

  return (
    <ThemeContextProvider>
      
        <span className="ml-4 flex w-44 space-x-2 p-2 rounded-md bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20">
          <UserButton
            showName
            appearance={{
              variables: appearanceVariables,
            }}

            // appearance={{
            //   variables:
            //     theme === "light"
            //       ? {
            //           colorPrimary: "blue",
            //         }
            //       : {
            //           colorPrimary: "darkblue",
            //         },
            // }}
          />
        </span>
    </ThemeContextProvider>
  );
}
