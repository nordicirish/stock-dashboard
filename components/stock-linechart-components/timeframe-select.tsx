import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeframeSelectProps {
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
}

export function TimeframeSelect({
  selectedTimeframe,
  onTimeframeChange,
}: TimeframeSelectProps) {
  return (
    <Select onValueChange={onTimeframeChange} value={selectedTimeframe}>
      <SelectTrigger className="w-full sm:w-[180px] bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200 h-10">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1D">1 Day</SelectItem>
        <SelectItem value="5D">5 Days</SelectItem>
        <SelectItem value="1M">1 Month</SelectItem>
        <SelectItem value="1Y">1 Year</SelectItem>
      </SelectContent>
    </Select>
  );
}
