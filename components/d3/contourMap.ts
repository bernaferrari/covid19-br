import * as d3 from "d3";
import * as topojson from "topojson-client";
import { getCitiesCSV, getMapFrom } from "../../utils/fetcher";

type City = Awaited<ReturnType<typeof getCitiesCSV>>[number];

type HeatmapRow = {
  city_ibge_code: number;
  confirmed: number;
};

type CovidCity = HeatmapRow & City;
type LonLat = [number, number];
type ScreenPoint = [number, number];

type ContourKind = "brazil" | "parana";

const colors = [
  "#023858",
  "#045a8d",
  "#0570b0",
  "#3690c0",
  "#74a9cf",
  "#a6bddb",
  "#d0d1e6",
  "#fff",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#fc4e2a",
  "#e31a1c",
  "#bd0026",
  "#800026",
];

const between = (num: number, a: number, b: number) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return num >= min && num <= max;
};

const readHeatmap = (path: string) =>
  d3.csv(path, (row) => ({
    confirmed: Number(row.c),
    city_ibge_code: Number(row.z),
  })) as Promise<HeatmapRow[]>;

const joinCities = (rows: HeatmapRow[], cities: City[]) =>
  rows.map((row) => {
    const city = cities.find((item) => item.city_ibge_code === row.city_ibge_code);
    return { ...row, ...city } as CovidCity;
  });

const makeRawPoints = (kind: ContourKind): LonLat[] => {
  const lats = kind === "brazil" ? d3.range(-34, 5.23, 2) : d3.range(-26.804461, -22.359125, 0.25);
  const lons =
    kind === "brazil" ? d3.range(-74, -34.25, 2) : d3.range(-54.666145, -48.201728, 0.25);

  return lons.flatMap((lon) => lats.map((lat) => [lon, lat] as LonLat));
};

const valueNearPoint = (point: LonLat, recentData: CovidCity[], radius: number) => {
  const matches = recentData.filter(
    (row) =>
      between(row.longitude, point[0] - radius, point[0] + radius) &&
      between(row.latitude, point[1] - radius, point[1] + radius),
  );

  return matches.reduce((total, row) => total + row.confirmed, 0);
};

const buildThresholdColorScale = (contours: d3.ContourMultiPolygon[]) => {
  const densityThresholds = contours.map((contour) => +contour.value);
  const linearColorScale = d3
    .scaleLinear<string>()
    .domain(d3.range(0, 1, 1 / colors.length))
    .range(colors)
    .interpolate(d3.interpolateLab);
  const quantized = d3.quantize(linearColorScale, densityThresholds.length * 2);

  return d3
    .scaleOrdinal<number, string>()
    .domain(densityThresholds)
    .range(quantized.slice(-densityThresholds.length));
};

export const renderContourMap = async (container: HTMLDivElement, kind: ContourKind) => {
  const isBrazil = kind === "brazil";
  const width = Math.min(container.clientWidth || 700, 700);
  const height = isBrazil ? 600 : 500;
  const mapName = isBrazil ? "map_br" : "map_pr";
  const objectName = isBrazil ? "Brasil" : "41";
  const heatmapPath = isBrazil ? "/data/br_heatmap.csv" : "/data/pr_heatmap.csv";
  const [map, heatmapRows, allCities] = await Promise.all([
    getMapFrom(mapName),
    readHeatmap(heatmapPath),
    getCitiesCSV(),
  ]);
  const cities = isBrazil ? allCities : allCities.filter((city) => city.codigo_uf === 41);
  const recentData = joinCities(heatmapRows, cities);
  const topology = map as Parameters<typeof topojson.feature>[0];
  const object = (map as { objects: Record<string, unknown> }).objects[objectName];
  const region = topojson.feature(topology, object as Parameters<typeof topojson.feature>[1]);
  const statesOuter = topojson.mesh(
    topology,
    object as Parameters<typeof topojson.mesh>[1],
    (a, b) => a === b,
  );
  const statesInner = topojson.mesh(
    topology,
    object as Parameters<typeof topojson.mesh>[1],
    (a, b) => a !== b,
  );
  const projection = d3.geoMercator().fitExtent(
    [
      [20, 0],
      [width - 20, height],
    ],
    isBrazil ? statesOuter : region,
  );
  const path = d3.geoPath().projection(projection);
  const rawPoints = makeRawPoints(kind);
  const lookup = new Map(
    rawPoints.map((point, index) => [
      index,
      valueNearPoint(point, recentData, isBrazil ? 2 : 0.25),
    ]),
  );
  const gridPoints = rawPoints
    .map((point, index) => {
      const centroid = projection(point);
      const value = d3.geoContains(region, point) ? lookup.get(index) : null;
      return centroid && value !== null ? { centroid: centroid as ScreenPoint, value } : null;
    })
    .filter((point): point is { centroid: ScreenPoint; value: number } => point !== null);
  const contourData = gridPoints.flatMap((point) =>
    Array.from({ length: Math.ceil(Math.sqrt(Math.abs(point.value))) }, () => point.centroid),
  );
  const contour = d3
    .contourDensity<ScreenPoint>()
    .x((point) => point[0])
    .y((point) => point[1])
    .size([width, height])
    .cellSize(2);

  if (isBrazil) contour.bandwidth(15);

  const contours = contour(contourData);
  const thresholdColorScale = buildThresholdColorScale(contours);
  const clipPathId = isBrazil ? "contourBrazilClipPath" : "contourParanaClipPath";
  const pathId = isBrazil ? "brPath" : "prPath";
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.style.textAlign = "center";

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
  if (isBrazil) svg.attr("class", "italy");

  const outer = svg
    .append("path")
    .datum(statesOuter)
    .attr("class", "outer")
    .attr("d", path)
    .attr("id", pathId);

  if (isBrazil) {
    outer.attr("fill", "none").attr("stroke", "#999").attr("stroke-width", "0.5px");
  } else {
    outer.style("fill", "white").attr("stroke", "#999").attr("stroke-width", "0.5px");
  }

  svg.append("clipPath").attr("id", clipPathId).append("use").attr("xlink:href", `#${pathId}`);

  svg
    .append("g")
    .selectAll(".contour")
    .data(contours)
    .join("g")
    .append("path")
    .attr("clip-path", `url(#${clipPathId})`)
    .attr("class", (contourPath) => `contour ${contourPath.value}`)
    .attr("d", d3.geoPath())
    .attr("fill", (contourPath) => thresholdColorScale(contourPath.value));

  svg
    .append("path")
    .datum(statesInner)
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", isBrazil ? "1px" : "0.5px")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  wrapper.append(svg.node() as SVGSVGElement);
  container.replaceChildren(wrapper);
};
