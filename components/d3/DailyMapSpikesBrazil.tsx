import { Box, Stack, Text } from "@chakra-ui/react";
import { geoMercator, geoPath, interpolateOranges, max, scaleSequentialSqrt, scaleSqrt } from "d3";
import { useMemo, useState } from "react";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import {
  formatDate,
  formatNumber,
  getMetricValue,
  latestDate,
  loadCities,
  loadMunicipalityDays,
  loadTopology,
  metricLabel,
  type City,
  type Metric,
  type MunicipalityDay,
} from "../../utils/covidData";
import { ChartFrame, DateSlider, MetricToggle, chartHeight, chartWidth } from "./chartUi";
import { useAsyncData } from "./useAsyncData";

type BrazilData = {
  topology: Topology;
  cities: City[];
  days: MunicipalityDay[];
};

const loadBrazilData = async (): Promise<BrazilData> => {
  const [topology, cities, days] = await Promise.all([
    loadTopology("brazil"),
    loadCities(),
    loadMunicipalityDays("brazil"),
  ]);

  return { topology, cities, days };
};

const getBrazilFeatures = (topology: Topology) =>
  feature(topology, topology.objects.Brasil as GeometryCollection) as FeatureCollection<
    Geometry,
    { UF: string; ESTADO: string }
  >;

const DailyMapSpikesBrazil = () => {
  const state = useAsyncData(loadBrazilData);
  const [metric, setMetric] = useState<Metric>("confirmed");
  const [dateIndex, setDateIndex] = useState<number | null>(null);

  const model = useMemo(() => {
    if (state.status !== "ready") return null;

    const dates = [...new Set(state.data.days.map((row) => row.date))].sort();
    const selectedIndex = dateIndex ?? Math.max(dates.length - 1, 0);
    const selectedDate = dates[selectedIndex] ?? latestDate(state.data.days);
    const currentRows = state.data.days.filter((row) => row.date === selectedDate);
    const citiesByCode = new Map(state.data.cities.map((city) => [city.code, city]));
    const states = getBrazilFeatures(state.data.topology);

    const projection = geoMercator().fitSize([chartWidth, chartHeight], states);
    const path = geoPath(projection);
    const maxValue = max(currentRows, (row) => getMetricValue(row, metric)) ?? 0;
    const radius = scaleSqrt().domain([0, maxValue]).range([0, 22]);
    const color = scaleSequentialSqrt(interpolateOranges).domain([0, maxValue]);

    const cityPoints = currentRows
      .map((row) => {
        const city = citiesByCode.get(row.cityCode);
        if (!city) return null;
        const point = projection([city.longitude, city.latitude]);
        if (!point) return null;
        const value = getMetricValue(row, metric);
        return { ...row, city, point, value };
      })
      .filter((point): point is NonNullable<typeof point> => Boolean(point))
      .filter((point) => point.value > 0);

    return { dates, selectedIndex, selectedDate, states, path, radius, color, cityPoints };
  }, [dateIndex, metric, state]);

  if (state.status === "loading") {
    return <ChartFrame status="loading" message="Carregando mapa do Brasil..." />;
  }

  if (state.status === "error") {
    return <ChartFrame status="error" message="Não foi possível carregar o mapa do Brasil." />;
  }

  if (!model || model.cityPoints.length === 0) {
    return <ChartFrame status="empty" message="Sem dados para o mapa do Brasil." />;
  }

  return (
    <Stack gap={4}>
      <MetricToggle value={metric} onChange={setMetric} />
      <DateSlider dates={model.dates} index={model.selectedIndex} onChange={setDateIndex} />
      <Text textAlign="center" fontSize="sm" color="gray.600">
        {metricLabel(metric)} por município em {formatDate(model.selectedDate)}
      </Text>
      <Box overflowX="auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label="Mapa do Brasil">
          <rect width={chartWidth} height={chartHeight} fill="#f8fafc" rx={12} />
          {model.states.features.map((stateFeature) => {
            return (
              <path
                key={stateFeature.properties.UF}
                d={model.path(stateFeature) ?? undefined}
                fill="#e5e7eb"
                stroke="#ffffff"
                strokeWidth={1}
              >
                <title>{stateFeature.properties.ESTADO}</title>
              </path>
            );
          })}
          {model.cityPoints.map((point) => (
            <circle
              key={point.cityCode}
              cx={point.point[0]}
              cy={point.point[1]}
              r={model.radius(point.value)}
              fill={model.color(point.value)}
              fillOpacity={0.52}
              stroke="#7c2d12"
              strokeOpacity={0.35}
              strokeWidth={0.6}
            >
              <title>
                {point.city.name}: {formatNumber(point.value)} {metricLabel(metric).toLowerCase()}
              </title>
            </circle>
          ))}
        </svg>
      </Box>
    </Stack>
  );
};

export default DailyMapSpikesBrazil;
