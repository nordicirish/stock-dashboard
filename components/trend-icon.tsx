import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendIconProps {
  trend: "up" | "down" | "neutral";
  className?: string;
}

export function TrendIcon({ trend, className = "" }: TrendIconProps) {
  if (trend === "up")
    return <TrendingUp className={`inline mr-1 h-4 w-4 ${className}`} />;
  if (trend === "down")
    return <TrendingDown className={`inline mr-1 h-4 w-4 ${className}`} />;
  return null;
}
