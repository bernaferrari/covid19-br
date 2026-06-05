import { useEffect, useRef, useState } from "react";

export type CaseMetric = "c" | "d";

export const metricOptions: { label: string; value: CaseMetric }[] = [
  { label: "casos", value: "c" },
  { label: "mortes", value: "d" },
];

export const RadioGroup = <T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <form>
    {options.map((option) => (
      <label
        key={option.value}
        style={{
          display: "inline-block",
          margin: "5px 10px 3px 0",
          fontSize: "0.85em",
        }}
      >
        <input
          type="radio"
          name={name}
          aria-label={option.label}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          style={{ verticalAlign: "baseline" }}
        />{" "}
        {option.label}
      </label>
    ))}
  </form>
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
    <form
      style={{
        font: "12px var(--sans-serif)",
        fontVariantNumeric: "tabular-nums",
        display: "flex",
        height: "33px",
        alignItems: "center",
      }}
    >
      <button
        name="b"
        type="button"
        style={{ marginRight: "0.4em", width: "5em" }}
        onClick={() => {
          if (!isPlaying && index < dates.length - 1) onChange(index + 1);
          setIsPlaying((value) => !value);
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <label style={{ display: "flex", alignItems: "center" }}>
        <input
          name="i"
          type="range"
          aria-label="Selecionar data"
          min={0}
          max={Math.max(dates.length - 1, 0)}
          value={index}
          step={1}
          style={{ width: "180px" }}
          onChange={(event) => {
            setIsPlaying(false);
            onChange(event.currentTarget.valueAsNumber);
          }}
        />
        <output name="o" style={{ marginLeft: "0.4em" }}>
          {selectedDate?.toLocaleDateString()}
        </output>
      </label>
    </form>
  );
};
