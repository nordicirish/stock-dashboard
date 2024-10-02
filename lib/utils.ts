import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StockListing, Stock } from "@/types/stock";

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

export function formatTimeForXAxis(
  timestamp: number,
  timeframe: string,
  timezone: string
): string {
  const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneMap[timezone] || "UTC",
  };

  if (timeframe === "1Y") {
    options.month = "short";
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } else if (timeframe === "1D") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } else if (timeframe === "5D") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
    options.weekday = "short";
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } else {
    options.month = "short";
    options.day = "numeric";
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
}
// Add these properties to the function
formatTimeForXAxis.prevDate = "";
formatTimeForXAxis.labelCount = 0;

export function formatDateLabel(timestamp: number, timezone: string): string {
  const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezoneMap[timezone] || "UTC",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatCurrency(
  value: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

export function calculatePercentChange(
  oldValue: number,
  newValue: number
): number {
  return ((newValue - oldValue) / oldValue) * 100;
}
export function getTrend(value: number): "up" | "down" | "neutral" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
}
export function getTrendColorClass(
  trend: "up" | "down" | "neutral",
  theme: string
): string {
  if (trend === "up")
    return theme === "dark" ? "text-green-400" : "text-green-600";
  if (trend === "down")
    return theme === "dark" ? "text-red-400" : "text-red-600";
  return "";
}
export function parseInputValue(value: string, type: "int" | "float"): number {
  if (type === "int") return parseInt(value, 10);
  return parseFloat(value);
}
export function getTimeframeOptions() {
  return [
    { value: "1D", label: "1 Day" },
    { value: "5D", label: "5 Days" },
    { value: "1M", label: "1 Month" },
    { value: "1Y", label: "1 Year" },
  ];
}
export function getDefaultStock(): StockListing {
  return {
    symbol: "^GSPC",
    name: "S&P 500",
  };
}

export function calculateTotalPortfolioValue(
  stocks: Stock[],
  currentPrices: Record<string, { price: number }>
): number {
  return stocks.reduce((total, stock) => {
    const currentPrice = currentPrices[stock.symbol]?.price || stock.avgPrice;
    return total + stock.quantity * currentPrice;
  }, 0);
}

export function calculateTotalPortfolioGain(
  stocks: Stock[],
  currentPrices: Record<string, { price: number }>
): number {
  return stocks.reduce((total, stock) => {
    const currentPrice = currentPrices[stock.symbol]?.price || stock.avgPrice;
    const gain = (currentPrice - stock.avgPrice) * stock.quantity;
    return total + gain;
  }, 0);
}
