import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTimeframeOptions } from "@/lib/utils";

interface TimeframeSelectProps {
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
}

export function TimeframeSelect({
  selectedTimeframe,
  onTimeframeChange,
}: TimeframeSelectProps) {
  const timeframeOptions = getTimeframeOptions();
  return (
    <Select onValueChange={onTimeframeChange} value={selectedTimeframe}>
      <SelectTrigger className="w-full sm:w-[180px] bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200 h-10">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        {timeframeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
