import { Box, Stack, Text } from "@chakra-ui/react";
import {
  extent,
  group,
  line,
  max,
  scaleLinear,
  scaleOrdinal,
  scaleTime,
  schemeTableau10,
} from "d3";
import { useMemo, useState } from "react";
import {
  formatNumber,
  getMetricValue,
  loadStateDays,
  metricLabel,
  parseCovidDate,
  type Metric,
  type StateDay,
} from "../../utils/covidData";
import { ChartFrame, MetricToggle, chartHeight, chartWidth } from "./chartUi";
import { useAsyncData } from "./useAsyncData";

const margin = { top: 20, right: 24, bottom: 34, left: 58 };

const DailyLinesBrazil = () => {
  const state = useAsyncData(loadStateDays);
  const [metric, setMetric] = useState<Metric>("confirmed");

  const model = useMemo(() => {
    if (state.status !== "ready") return null;

    const latestByState = new Map<string, StateDay>();
    for (const row of state.data) {
      const current = latestByState.get(row.state);
      if (!current || row.date > current.date) latestByState.set(row.state, row);
    }

    const selectedStates = [...latestByState.values()]
      .sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric))
      .slice(0, 8)
      .map((row) => row.state);

    const selected = state.data.filter((row) => selectedStates.includes(row.state));
    const series = [...group(selected, (row) => row.state).entries()].map(([name, rows]) => ({
      name,
      rows: rows.sort((a, b) => a.date.localeCompare(b.date)),
    }));

    const dateExtent = extent(selected, (row) => parseCovidDate(row.date));
    const valueMax = max(selected, (row) => getMetricValue(row, metric)) ?? 0;
    const x = scaleTime()
      .domain([dateExtent[0] ?? new Date(), dateExtent[1] ?? new Date()])
      .range([margin.left, chartWidth - margin.right]);
    const y = scaleLinear()
      .domain([0, valueMax])
      .nice()
      .range([chartHeight - margin.bottom, margin.top]);
    const color = scaleOrdinal<string, string>().domain(selectedStates).range(schemeTableau10);
    const pathFor = line<StateDay>()
      .x((row) => x(parseCovidDate(row.date)))
      .y((row) => y(getMetricValue(row, metric)));

    return { series, x, y, color, pathFor, valueMax };
  }, [metric, state]);

  if (state.status === "loading") {
    return <ChartFrame status="loading" message="Carregando séries estaduais..." />;
  }

  if (state.status === "error") {
    return <ChartFrame status="error" message="Não foi possível carregar as séries estaduais." />;
  }

  if (!model || model.series.length === 0) {
    return <ChartFrame status="empty" message="Sem dados estaduais disponíveis." />;
  }

  const yTicks = model.y.ticks(5);
  const xTicks = model.x.ticks(5);

  return (
    <Stack gap={4}>
      <MetricToggle value={metric} onChange={setMetric} />
      <Text textAlign="center" fontSize="sm" color="gray.600">
        Evolução de {metricLabel(metric).toLowerCase()} nos estados com maiores valores finais
      </Text>
      <Box overflowX="auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label="Séries estaduais">
          <rect width={chartWidth} height={chartHeight} fill="#ffffff" rx={12} />
          {yTicks.map((tick) => (
            <g key={tick} transform={`translate(0 ${model.y(tick)})`}>
              <line x1={margin.left} x2={chartWidth - margin.right} stroke="#e5e7eb" />
              <text x={margin.left - 8} dy="0.32em" textAnchor="end" fontSize={11} fill="#6b7280">
                {formatNumber(tick)}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <g key={tick.toISOString()} transform={`translate(${model.x(tick)} 0)`}>
              <line y1={margin.top} y2={chartHeight - margin.bottom} stroke="#f3f4f6" />
              <text
                y={chartHeight - margin.bottom + 20}
                textAnchor="middle"
                fontSize={11}
                fill="#6b7280"
              >
                {tick.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}
              </text>
            </g>
          ))}
          {model.series.map((series) => (
            <path
              key={series.name}
              d={model.pathFor(series.rows) ?? undefined}
              fill="none"
              stroke={model.color(series.name)}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={3}>
        {model.series.map((series) => (
          <Text key={series.name} fontSize="xs" color="gray.700">
            <Box
              as="span"
              display="inline-block"
              w={3}
              h={3}
              rounded="full"
              bg={model.color(series.name)}
              mr={1}
            />
            {series.name}
          </Text>
        ))}
      </Box>
    </Stack>
  );
};

export default DailyLinesBrazil;
