import { Box, Stack, Text } from "@chakra-ui/react";
import { geoMercator, geoPath, interpolatePurples, max, scaleSequentialSqrt } from "d3";
import { useMemo, useState } from "react";
import { feature, mesh } from "topojson-client";
import type { FeatureCollection, Geometry, MultiLineString } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import {
  formatDate,
  formatNumber,
  getMetricValue,
  indexByCityCode,
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

type ParanaData = {
  topology: Topology;
  cities: City[];
  days: MunicipalityDay[];
};

const loadParanaData = async (): Promise<ParanaData> => {
  const [topology, cities, days] = await Promise.all([
    loadTopology("parana"),
    loadCities(),
    loadMunicipalityDays("parana"),
  ]);

  return { topology, cities, days };
};

const getParanaFeatures = (topology: Topology) =>
  feature(topology, topology.objects["41"] as GeometryCollection) as FeatureCollection<
    Geometry,
    { cod: number }
  >;

const DailyMapFilledParana = () => {
  const state = useAsyncData(loadParanaData);
  const [metric, setMetric] = useState<Metric>("confirmed");
  const [dateIndex, setDateIndex] = useState<number | null>(null);

  const model = useMemo(() => {
    if (state.status !== "ready") return null;

    const dates = [...new Set(state.data.days.map((row) => row.date))].sort();
    const selectedIndex = dateIndex ?? Math.max(dates.length - 1, 0);
    const selectedDate = dates[selectedIndex] ?? latestDate(state.data.days);
    const currentRows = state.data.days.filter((row) => row.date === selectedDate);
    const valuesByCity = indexByCityCode(currentRows);
    const citiesByCode = new Map(state.data.cities.map((city) => [city.code, city]));
    const municipalities = getParanaFeatures(state.data.topology);
    const boundaries = mesh(
      state.data.topology,
      state.data.topology.objects["41"] as GeometryCollection,
      (a, b) => a !== b,
    ) as MultiLineString;

    const projection = geoMercator().fitSize([chartWidth, chartHeight], municipalities);
    const path = geoPath(projection);
    const maxValue = max(currentRows, (row) => getMetricValue(row, metric)) ?? 0;
    const color = scaleSequentialSqrt(interpolatePurples).domain([0, maxValue]);

    const leaders = [...currentRows]
      .sort((a, b) => getMetricValue(b, metric) - getMetricValue(a, metric))
      .slice(0, 5)
      .map((row) => ({ ...row, city: citiesByCode.get(row.cityCode) }))
      .filter((row): row is typeof row & { city: City } => Boolean(row.city));

    return {
      dates,
      selectedIndex,
      selectedDate,
      municipalities,
      boundaries,
      path,
      color,
      valuesByCity,
      leaders,
    };
  }, [dateIndex, metric, state]);

  if (state.status === "loading") {
    return <ChartFrame status="loading" message="Carregando mapa do Paraná..." />;
  }

  if (state.status === "error") {
    return <ChartFrame status="error" message="Não foi possível carregar o mapa do Paraná." />;
  }

  if (!model) {
    return <ChartFrame status="empty" message="Sem dados para o mapa do Paraná." />;
  }

  return (
    <Stack gap={4}>
      <MetricToggle value={metric} onChange={setMetric} />
      <DateSlider dates={model.dates} index={model.selectedIndex} onChange={setDateIndex} />
      <Text textAlign="center" fontSize="sm" color="gray.600">
        {metricLabel(metric)} por município em {formatDate(model.selectedDate)}
      </Text>
      <Box overflowX="auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label="Mapa do Paraná">
          <rect width={chartWidth} height={chartHeight} fill="#f8fafc" rx={12} />
          {model.municipalities.features.map((municipality) => {
            const cityCode = Number(municipality.properties.cod);
            const row = model.valuesByCity.get(cityCode);
            const value = row ? getMetricValue(row, metric) : 0;

            return (
              <path
                key={cityCode}
                d={model.path(municipality) ?? undefined}
                fill={value > 0 ? model.color(value) : "#f3f4f6"}
                stroke="#ffffff"
                strokeWidth={0.35}
              >
                <title>
                  {cityCode}: {formatNumber(value)} {metricLabel(metric).toLowerCase()}
                </title>
              </path>
            );
          })}
          <path d={model.path(model.boundaries) ?? undefined} fill="none" stroke="#ffffff" />
        </svg>
      </Box>
      <Text fontSize="xs" color="gray.600" textAlign="center">
        Maiores valores:{" "}
        {model.leaders
          .map((row) => `${row.city.name} (${formatNumber(getMetricValue(row, metric))})`)
          .join(", ")}
      </Text>
    </Stack>
  );
};

export default DailyMapFilledParana;
