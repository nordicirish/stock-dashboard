import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string; // Optional message prop
  size?: number; // Optional size prop for the spinner
  height?: string; // Optional height prop for the container
}

export function LoadingSpinner({
  message = "Loading...",
  size = 24, // Default size
  height = "400px", // Default height
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col justify-center items-center h-[${height}]`}>
      <Loader2 className={`h-${size} w-${size} animate-spin`} />
      <p className="text-center mt-4">{message}</p>
    </div>
  );
}
