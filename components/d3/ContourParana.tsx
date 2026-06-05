import { Box, Stack, Text } from "@chakra-ui/react";
import { geoMercator, geoPath, interpolateReds, max, scaleSequentialSqrt } from "d3";
import { useMemo } from "react";
import { feature, mesh } from "topojson-client";
import type { FeatureCollection, Geometry, MultiLineString } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import {
  formatNumber,
  indexByCityCode,
  loadHeatmapPoints,
  loadTopology,
  type HeatmapPoint,
} from "../../utils/covidData";
import { ChartFrame, chartHeight, chartWidth } from "./chartUi";
import { useAsyncData } from "./useAsyncData";

type ParanaHeatmapData = {
  topology: Topology;
  points: HeatmapPoint[];
};

const loadParanaHeatmapData = async (): Promise<ParanaHeatmapData> => {
  const [topology, points] = await Promise.all([
    loadTopology("parana"),
    loadHeatmapPoints("parana"),
  ]);
  return { topology, points };
};

const getParanaFeatures = (topology: Topology) =>
  feature(topology, topology.objects["41"] as GeometryCollection) as FeatureCollection<
    Geometry,
    { cod: number }
  >;

const ContourParana = () => {
  const state = useAsyncData(loadParanaHeatmapData);

  const model = useMemo(() => {
    if (state.status !== "ready") return null;

    const municipalities = getParanaFeatures(state.data.topology);
    const boundaries = mesh(
      state.data.topology,
      state.data.topology.objects["41"] as GeometryCollection,
      (a, b) => a !== b,
    ) as MultiLineString;
    const valuesByCity = indexByCityCode(state.data.points);
    const projection = geoMercator().fitSize([chartWidth, chartHeight], municipalities);
    const path = geoPath(projection);
    const maxValue = max(state.data.points, (point) => point.confirmed) ?? 0;
    const color = scaleSequentialSqrt(interpolateReds).domain([0, maxValue]);

    return { municipalities, boundaries, valuesByCity, path, color };
  }, [state]);

  if (state.status === "loading") {
    return <ChartFrame status="loading" message="Carregando concentração no Paraná..." />;
  }

  if (state.status === "error") {
    return <ChartFrame status="error" message="Não foi possível carregar a concentração." />;
  }

  if (!model) {
    return <ChartFrame status="empty" message="Sem dados para concentração no Paraná." />;
  }

  return (
    <Stack gap={3}>
      <Text textAlign="center" fontSize="sm" color="gray.600">
        Concentração municipal de casos confirmados no Paraná
      </Text>
      <Box overflowX="auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label="Casos no Paraná">
          <rect width={chartWidth} height={chartHeight} fill="#f8fafc" rx={12} />
          {model.municipalities.features.map((municipality) => {
            const cityCode = Number(municipality.properties.cod);
            const value = model.valuesByCity.get(cityCode)?.confirmed ?? 0;
            return (
              <path
                key={cityCode}
                d={model.path(municipality) ?? undefined}
                fill={value > 0 ? model.color(value) : "#f3f4f6"}
                stroke="#ffffff"
                strokeWidth={0.35}
              >
                <title>
                  {cityCode}: {formatNumber(value)} casos
                </title>
              </path>
            );
          })}
          <path d={model.path(model.boundaries) ?? undefined} fill="none" stroke="#ffffff" />
        </svg>
      </Box>
    </Stack>
  );
};

export default ContourParana;
