import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CaseMetric = "c" | "d";

export const metricOptions: { label: string; value: CaseMetric }[] = [
  { label: "casos", value: "c" },
  { label: "mortes", value: "d" },
];

export const TabsGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <Tabs value={value} onValueChange={(nextValue) => onChange(nextValue as T)}>
    <TabsList aria-label={label}>
      {options.map((option) => (
        <TabsTrigger key={option.value} value={option.value}>
          {option.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export const DateScrubber = ({
  dates,
  index,
  delay = 200,
  onChange,
}: {
  dates: Date[];
  index: number;
  delay?: number;
  onChange: (index: number) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying || dates.length === 0) return;

    intervalRef.current = setInterval(() => {
      onChange(index >= dates.length - 1 ? index : index + 1);
      if (index >= dates.length - 1) setIsPlaying(false);
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dates.length, delay, index, isPlaying, onChange]);

  const selectedDate = dates[index];
  const lastIndex = Math.max(dates.length - 1, 0);

  return (
    <div className="flex w-full min-w-0 items-center gap-2 text-xs [font-variant-numeric:tabular-nums]">
      <Button
        type="button"
        variant="ghost"
        className="w-20"
        onClick={() => {
          if (isPlaying) {
            setIsPlaying(false);
            return;
          }

          if (index >= lastIndex) onChange(0);
          setIsPlaying(true);
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
        {isPlaying ? "Pause" : "Play"}
      </Button>

      <div className="min-w-20 flex-1 sm:w-[180px] sm:flex-none">
        <Slider
          aria-label="Selecionar data"
          min={0}
          max={lastIndex}
          step={1}
          value={index}
          defaultValue={[0]}
          onValueChange={(nextValue) => {
            const value = Array.isArray(nextValue) ? nextValue[0] : nextValue;

            setIsPlaying(false);
            onChange(value ?? 0);
          }}
        />
      </div>

      <output className="min-w-16 pr-2 text-right sm:min-w-[4.75rem]">
        {selectedDate?.toLocaleDateString()}
      </output>
    </div>
  );
};

export const DateScrubberControl = ({
  dates,
  index,
  onChange,
}: {
  dates: Date[];
  index: number;
  onChange: (index: number) => void;
}) => (
  <div className="flex h-8 w-full max-w-sm items-center rounded-lg border">
    <DateScrubber dates={dates} index={index} onChange={onChange} />
  </div>
);
