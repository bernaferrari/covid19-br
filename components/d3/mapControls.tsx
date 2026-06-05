import { useEffect, useRef, useState } from "react";
import { RadioGroup as UiRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type CaseMetric = "c" | "d";

export const metricOptions: { label: string; value: CaseMetric }[] = [
  { label: "casos", value: "c" },
  { label: "mortes", value: "d" },
];

export const RadioGroup = <T extends string>({
  name: _name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <UiRadioGroup
    value={value}
    onValueChange={(nextValue) => onChange(nextValue as T)}
    className="flex w-auto flex-row flex-wrap items-center gap-0"
  >
    {options.map((option) => (
      <label
        key={option.value}
        className="mr-2.5 mb-[3px] inline-flex items-center gap-1.5 text-[0.85em]"
      >
        <RadioGroupItem value={option.value} aria-label={option.label} className="align-baseline" />
        {option.label}
      </label>
    ))}
  </UiRadioGroup>
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

  return (
    <form className="flex h-[33px] items-center text-xs [font-variant-numeric:tabular-nums]">
      <button
        name="b"
        type="button"
        className="mr-[0.4em] w-[5em]"
        onClick={() => {
          if (!isPlaying && index < dates.length - 1) onChange(index + 1);
          setIsPlaying((value) => !value);
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <label className="flex items-center">
        <input
          name="i"
          type="range"
          aria-label="Selecionar data"
          min={0}
          max={Math.max(dates.length - 1, 0)}
          value={index}
          step={1}
          className="w-[180px]"
          onChange={(event) => {
            setIsPlaying(false);
            onChange(event.currentTarget.valueAsNumber);
          }}
        />
        <output name="o" className="ml-[0.4em]">
          {selectedDate?.toLocaleDateString()}
        </output>
      </label>
    </form>
  );
};
