import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const timezoneMap: { [key: string]: string } = {
  EDT: "America/New_York",
  EST: "America/New_York",
  CST: "America/Chicago",
  PST: "America/Los_Angeles",
  // Add more mappings as needed
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateForTooltip(
  timestamp: number,
  timeframe: string,
  timezone: string
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneMap[timezone] || "UTC",
    hour12: false,
  };

  const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds

  switch (timeframe) {
    case "1D":
    case "5D":
      options.month = "short";
      options.day = "numeric";
      options.hour = "2-digit";
      options.minute = "2-digit";
      break;
       
    case "1M":
    case "1Y":
      options.year = "numeric";
      options.month = "short";
      options.day = "numeric";
      break;
    default:
      options.year = "numeric";
      options.month = "short";
      options.day = "numeric";
  }

  try {
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    // Fallback to UTC if there's an error
    options.timeZone = "UTC";
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
}
