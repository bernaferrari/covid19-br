import { Box, Stack, Text } from "@chakra-ui/react";
import { geoMercator, geoPath, interpolateReds, max, scaleSequentialSqrt, scaleSqrt } from "d3";
import { useMemo } from "react";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import {
  formatNumber,
  loadCities,
  loadHeatmapPoints,
  loadTopology,
  type City,
  type HeatmapPoint,
} from "../../utils/covidData";
import { ChartFrame, chartHeight, chartWidth } from "./chartUi";
import { useAsyncData } from "./useAsyncData";

type BrazilHeatmapData = {
  topology: Topology;
  cities: City[];
  points: HeatmapPoint[];
};

const loadBrazilHeatmapData = async (): Promise<BrazilHeatmapData> => {
  const [topology, cities, points] = await Promise.all([
    loadTopology("brazil"),
    loadCities(),
    loadHeatmapPoints("brazil"),
  ]);

  return { topology, cities, points };
};

const getBrazilFeatures = (topology: Topology) =>
  feature(topology, topology.objects.Brasil as GeometryCollection) as FeatureCollection<
    Geometry,
    { UF: string; ESTADO: string }
  >;

const ContourBrazil = () => {
  const state = useAsyncData(loadBrazilHeatmapData);

  const model = useMemo(() => {
    if (state.status !== "ready") return null;

    const states = getBrazilFeatures(state.data.topology);
    const citiesByCode = new Map(state.data.cities.map((city) => [city.code, city]));
    const projection = geoMercator().fitSize([chartWidth, chartHeight], states);
    const path = geoPath(projection);
    const maxValue = max(state.data.points, (point) => point.confirmed) ?? 0;
    const radius = scaleSqrt().domain([0, maxValue]).range([1.5, 16]);
    const color = scaleSequentialSqrt(interpolateReds).domain([0, maxValue]);
    const points = state.data.points
      .map((point) => {
        const city = citiesByCode.get(point.cityCode);
        if (!city) return null;
        const projected = projection([city.longitude, city.latitude]);
        return projected ? { ...point, city, projected } : null;
      })
      .filter((point): point is NonNullable<typeof point> => Boolean(point));

    return { states, path, points, radius, color };
  }, [state]);

  if (state.status === "loading") {
    return <ChartFrame status="loading" message="Carregando concentração de casos..." />;
  }

  if (state.status === "error") {
    return <ChartFrame status="error" message="Não foi possível carregar a concentração." />;
  }

  if (!model || model.points.length === 0) {
    return <ChartFrame status="empty" message="Sem dados para concentração." />;
  }

  return (
    <Stack gap={3}>
      <Text textAlign="center" fontSize="sm" color="gray.600">
        Concentração municipal de casos confirmados no Brasil
      </Text>
      <Box overflowX="auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label="Casos no Brasil">
          <rect width={chartWidth} height={chartHeight} fill="#f8fafc" rx={12} />
          {model.states.features.map((stateFeature) => (
            <path
              key={stateFeature.properties.UF}
              d={model.path(stateFeature) ?? undefined}
              fill="#e5e7eb"
              stroke="#ffffff"
            />
          ))}
          {model.points.map((point) => (
            <circle
              key={point.cityCode}
              cx={point.projected[0]}
              cy={point.projected[1]}
              r={model.radius(point.confirmed)}
              fill={model.color(point.confirmed)}
              fillOpacity={0.45}
              stroke="#7f1d1d"
              strokeOpacity={0.22}
            >
              <title>
                {point.city.name}: {formatNumber(point.confirmed)} casos
              </title>
            </circle>
          ))}
        </svg>
      </Box>
    </Stack>
  );
};

export default ContourBrazil;
