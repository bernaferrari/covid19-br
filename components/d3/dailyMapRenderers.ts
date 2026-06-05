import * as d3 from "d3";
import * as topojson from "topojson-client";
import { getCitiesCSV, getMapFrom } from "../../utils/fetcher";
import type { CaseMetric } from "./mapControls";

type City = Awaited<ReturnType<typeof getCitiesCSV>>[number];

export type DailyRow = {
  date: string;
  z: number;
  c: number;
  d: number;
};

type DailyCityRow = DailyRow & Partial<City>;
type DailyData = Record<string, DailyCityRow[]>;

export type DailyMapData = {
  data: DailyData;
  dates: Date[];
  map: unknown;
  cities: City[];
};

const parseDate = d3.utcParse("%Y-%m-%d");
const numFormat = d3.format(",");
const shortFormat = d3.format(".2~s");

const readDailyCsv = (path: string) =>
  d3.csv(path, (row) => ({
    date: row.date ?? "",
    z: Number(row.z),
    c: Number(row.c),
    d: Number(row.d),
  })) as Promise<DailyRow[]>;

const groupByDate = (rows: DailyCityRow[]) =>
  rows.reduce<DailyData>((acc, row) => {
    acc[row.date] ??= [];
    acc[row.date].push(row);
    return acc;
  }, {});

const dataDates = (data: DailyData) =>
  Object.keys(data)
    .map((date) => parseDate(date) ?? new Date(date))
    .reverse();

const currentData = (data: DailyData, index: number) => {
  const keys = Object.keys(data);
  return data[keys[keys.length - 1 - index]] ?? [];
};

const cityByCode = (cities: City[]) =>
  new Map(cities.map((city) => [city.city_ibge_code, city] as const));

const maxCases = (data: DailyData, metric: CaseMetric) => {
  let highestValue = 0;

  for (const key in data) {
    const value = d3.max(data[key], (row) => row[metric]) ?? 0;
    if (value > highestValue) highestValue = value;
  }

  return highestValue;
};

const toTopology = (map: unknown) => map as Parameters<typeof topojson.feature>[0];

const topologyObject = (map: unknown, key: string) =>
  (map as { objects: Record<string, unknown> }).objects[key] as Parameters<
    typeof topojson.feature
  >[1];

const makeSequentialLegend = (
  container: HTMLDivElement,
  color: d3.ScaleSequential<string, never>,
  title: string,
) => {
  const width = 320;
  const height = 50;
  const marginTop = 18;
  const marginBottom = 22;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 1;
  const context = canvas.getContext("2d");

  const domain = color.domain() as [number, number];

  if (context) {
    for (let i = 0; i < width; ++i) {
      const value = domain[0] + (i / (width - 1)) * (domain[1] - domain[0]);
      context.fillStyle = color(value);
      context.fillRect(i, 0, 1, 1);
    }
  }

  const x = d3.scaleLinear().domain(domain).range([0, width]);
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("overflow", "visible")
    .style("display", "block");

  svg
    .append("image")
    .attr("x", 0)
    .attr("y", marginTop)
    .attr("width", width)
    .attr("height", height - marginTop - marginBottom)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href", canvas.toDataURL());
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(3).tickSize(6))
    .call((group) => group.select(".domain").remove())
    .call((group) => {
      if (!title) return;

      group
        .append("text")
        .attr("x", 0)
        .attr("y", -height + 13)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(title);
    });

  container.replaceChildren(svg.node() as SVGSVGElement);
};

export const loadBrazilDailyMapData = async (): Promise<DailyMapData> => {
  const [rows, cities, map] = await Promise.all([
    readDailyCsv("/data/br_ndays.csv"),
    getCitiesCSV(),
    getMapFrom("map_br"),
  ]);
  const citiesByCode = cityByCode(cities);
  const enrichedRows = rows.map((row) => ({
    ...row,
    ...citiesByCode.get(row.z),
  }));
  const data = groupByDate(enrichedRows);

  return { data, dates: dataDates(data), map, cities };
};

export const loadParanaDailyMapData = async (): Promise<DailyMapData> => {
  const [rows, cities, map] = await Promise.all([
    readDailyCsv("/data/pr_ndays.csv"),
    getCitiesCSV(),
    getMapFrom("map_pr"),
  ]);
  const paranaCities = cities.filter((city) => city.codigo_uf === 41);
  const data = groupByDate(rows);

  return { data, dates: dataDates(data), map, cities: paranaCities };
};

export const renderBrazilSpikeMap = (
  container: HTMLDivElement,
  mapData: DailyMapData,
  metric: CaseMetric,
  scaleType: "bolhas" | "espinhos",
  index: number,
) => {
  const width = Math.min(container.clientWidth || 700, 700);
  const height = 500;
  const breakpoint = 500;
  const maxValue = maxCases(mapData.data, metric);
  const maxRadius = width > breakpoint ? 30 : 18;
  const radius = d3.scaleSqrt().domain([0, maxValue]).range([0, maxRadius]);
  const colorScale = d3
    .scaleSqrt<string>()
    .domain([0, maxValue])
    .range(["hsla(57, 100%, 50%, 0.36)", "hsla(7, 100%, 50%, 0.57)"]);
  const topology = toTopology(mapData.map);
  const object = topologyObject(mapData.map, "Brasil");
  const provinces = topojson.feature(topology, object);
  const projection = d3.geoMercator().fitExtent(
    [
      [20, 0],
      [width > 600 ? width - 60 : width - 20, height],
    ],
    provinces,
  );
  const path = d3.geoPath().projection(projection);
  const current = currentData(mapData.data, index);
  const recent = mapData.data[Object.keys(mapData.data)[0]] ?? [];
  const yScale = d3.scaleSqrt([0, d3.max(recent, (row) => row[metric]) ?? 0], [0, 80]);
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.style.textAlign = "center";
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]).attr("class", "italy");

  svg
    .selectAll(".subunit")
    .data((provinces as { features: unknown[] }).features)
    .enter()
    .append("path")
    .attr("class", "subunit")
    .attr("d", (feature) => path(feature as d3.GeoPermissibleObjects))
    .attr("fill", "#f4f4f4")
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5);

  if (scaleType === "bolhas") {
    svg
      .selectAll(".bubble")
      .data(current)
      .enter()
      .append("circle")
      .attr(
        "transform",
        (row) => `translate(${projection([row.longitude ?? 0, row.latitude ?? 0])})`,
      )
      .attr("class", "bubble")
      .attr("fill-opacity", 0.5)
      .attr("fill", (row) => colorScale(row[metric]))
      .attr("r", (row) => radius(row[metric]))
      .append("title")
      .text((row) => `${row.city}: ${numFormat(row[metric])}`);

    const legendRadii = [maxValue / 8, maxValue / 4, maxValue / 2, maxValue].map((value) =>
      Math.round(value),
    );
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("fill", "#777")
      .attr("transform", `translate(10,${height - 25})`);
    legend
      .append("text")
      .attr("class", "legend-title")
      .text(metric === "c" ? "Nº de casos confirmados" : "Nº de óbitos")
      .attr("dy", -maxRadius * 3.0);
    let margin = 0;
    const bubbles = legend.selectAll("g").data(legendRadii).join("g");
    bubbles
      .attr("transform", (value, itemIndex) => {
        margin += itemIndex === 0 ? 0 : radius(legendRadii[itemIndex - 1]) * 2 + 15;
        return `translate(${margin + radius(value)}, 0)`;
      })
      .append("circle")
      .attr("class", "legend-bubble")
      .attr("fill", (value) => colorScale(value))
      .attr("cy", (value) => -radius(value))
      .attr("r", radius);
    bubbles
      .append("text")
      .attr("dy", "1.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .text(shortFormat);
  } else {
    const gradientId = `spike-gradient-${Math.random().toString(36).slice(2)}`;
    const gradientColors = d3.scaleOrdinal<number, string>([100, 0], ["#f3f3f3", "#cc0000"]);

    svg
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
      .selectAll("stop")
      .data([0, 100])
      .join("stop")
      .attr("offset", (value) => `${value}%`)
      .attr("stop-color", (value) => gradientColors(value));

    svg
      .selectAll("polyline")
      .data(current)
      .enter()
      .append("polyline")
      .attr("class", "polyline")
      .attr("id", (row) => String(row.z))
      .attr("points", (row) => {
        const h = yScale(row[metric]);
        if (h === 0) return null;
        const [x, y] = projection([row.longitude ?? 0, row.latitude ?? 0]) ?? [0, 0];
        return `${x - 4},${y} ${x},${y - h} ${x + 4},${y}`;
      })
      .attr("stroke", (row) => colorScale(row[metric]))
      .attr("fill", `url(#${gradientId})`)
      .append("title")
      .text((row) => `${row.city}: ${numFormat(row[metric])} casos`);
  }

  wrapper.append(svg.node() as SVGSVGElement);
  container.replaceChildren(wrapper);
};

export const renderParanaFilledMap = (
  container: HTMLDivElement,
  legendContainer: HTMLDivElement | null,
  mapData: DailyMapData,
  metric: CaseMetric,
  index: number,
) => {
  const width = Math.min(container.clientWidth || 700, 700);
  const height = Math.min(container.clientWidth || 700, 400);
  const maxValue = maxCases(mapData.data, metric);
  const colorScale = d3
    .scaleSequentialSqrt(metric === "c" ? d3.interpolateYlGnBu : d3.interpolateYlOrRd)
    .domain([0, maxValue]);
  const topology = toTopology(mapData.map);
  const object = topologyObject(mapData.map, "41");
  const estado = topojson.feature(topology, object);
  const statesOuter = topojson.mesh(
    topology,
    object as Parameters<typeof topojson.mesh>[1],
    (a, b) => a === b,
  );
  const projection = d3.geoMercator().fitExtent(
    [
      [20, 0],
      [width - 20, height],
    ],
    estado,
  );
  const path = d3.geoPath().projection(projection);
  const current = currentData(mapData.data, index);
  const currentByCityCode = new Map(current.map((row) => [row.z, row] as const));
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.style.textAlign = "center";
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]).attr("class", "italy");

  svg
    .append("path")
    .datum(statesOuter)
    .attr("class", "outer")
    .attr("d", path)
    .attr("id", "usPath")
    .attr("stroke", "grey")
    .attr("stroke-width", "1px");

  svg
    .selectAll(".subunit")
    .data(
      (
        estado as unknown as {
          features: (d3.GeoPermissibleObjects & { properties: { cod: number } })[];
        }
      ).features,
    )
    .enter()
    .append("path")
    .attr("stroke", "#BBB")
    .attr("class", "county")
    .style("stroke-width", (feature) => {
      const row = currentByCityCode.get(feature.properties.cod);
      return row && row[metric] > 0 ? "0px" : "0.25px";
    })
    .attr("fill", (feature) => {
      const row = currentByCityCode.get(feature.properties.cod);
      const value = row?.[metric] ?? 0;
      return value > 0 ? colorScale(value) : "#fff";
    })
    .attr("d", (feature) => path(feature))
    .append("title")
    .text((feature) => {
      const row = currentByCityCode.get(feature.properties.cod);
      return `${row?.[metric] ?? 0}`;
    });

  if (legendContainer) {
    makeSequentialLegend(legendContainer, colorScale, "");
  }

  wrapper.append(svg.node() as SVGSVGElement);
  container.replaceChildren(wrapper);
};
