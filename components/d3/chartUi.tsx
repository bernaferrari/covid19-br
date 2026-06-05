import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import type { Metric } from "../../utils/covidData";

export const chartWidth = 720;
export const chartHeight = 420;

type ChartFrameProps = PropsWithChildren<{
  status?: "loading" | "error" | "empty" | "ready";
  message?: string;
}>;

export const ChartFrame = ({ status = "ready", message, children }: ChartFrameProps) => {
  if (status === "ready") {
    return <Box w="100%">{children}</Box>;
  }

  return (
    <Flex
      minH="280px"
      align="center"
      justify="center"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="lg"
      bg="white"
    >
      <Flex direction="column" align="center" gap={3}>
        {status === "loading" && <Spinner colorPalette="purple" />}
        <Text fontSize="sm" color={status === "error" ? "red.600" : "gray.600"}>
          {message}
        </Text>
      </Flex>
    </Flex>
  );
};

type MetricToggleProps = {
  value: Metric;
  onChange: (value: Metric) => void;
};

export const MetricToggle = ({ value, onChange }: MetricToggleProps) => (
  <Flex justify="center" gap={2} wrap="wrap">
    {[
      ["confirmed", "Casos"],
      ["deaths", "Óbitos"],
    ].map(([metric, label]) => (
      <Button
        key={metric}
        type="button"
        size="sm"
        variant={value === metric ? "subtle" : "outline"}
        colorPalette={value === metric ? "purple" : "gray"}
        onClick={() => onChange(metric as Metric)}
      >
        {label}
      </Button>
    ))}
  </Flex>
);

type DateSliderProps = {
  dates: string[];
  index: number;
  onChange: (index: number) => void;
};

export const DateSlider = ({ dates, index, onChange }: DateSliderProps) => (
  <Flex align="center" gap={3} maxW="520px" mx="auto">
    <Text fontSize="xs" color="gray.500" minW="76px">
      {dates[0]}
    </Text>
    <input
      aria-label="Selecionar data"
      type="range"
      min={0}
      max={Math.max(dates.length - 1, 0)}
      value={index}
      style={{ width: "100%" }}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
    />
    <Text fontSize="xs" color="gray.500" minW="76px" textAlign="right">
      {dates.at(-1)}
    </Text>
  </Flex>
);
