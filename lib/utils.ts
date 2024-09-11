import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateForTooltip(date: Date, timeframe: string): string {
  switch (timeframe) {
    case "1D":
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case "5D":
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case "1M":
    case "1Y":
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    default:
      return date.toLocaleDateString();
  }
}
