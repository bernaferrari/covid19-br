import { csv, json, timeParse } from "d3";
import type { DSVRowString } from "d3";
import type { Topology } from "topojson-specification";

export type Metric = "confirmed" | "deaths";

export type City = {
  code: number;
  name: string;
  latitude: number;
  longitude: number;
  stateCode: number;
};

export type MunicipalityDay = {
  date: string;
  cityCode: number;
  confirmed: number;
  deaths: number;
};

export type StateDay = {
  date: string;
  state: string;
  confirmed: number;
  deaths: number;
  confirmedPer100k: number;
};

export type HeatmapPoint = {
  cityCode: number;
  confirmed: number;
};

type Cache = {
  cities?: City[];
  brazilTopology?: Topology;
  paranaTopology?: Topology;
  brazilMunicipalityDays?: MunicipalityDay[];
  paranaMunicipalityDays?: MunicipalityDay[];
  paranaTopCityDays?: MunicipalityDay[];
  stateDays?: StateDay[];
  brazilHeatmap?: HeatmapPoint[];
  paranaHeatmap?: HeatmapPoint[];
};

const cache: Cache = {};
const parseDateValue = timeParse("%Y-%m-%d");

const numberFrom = (value: string | undefined) => Number(value ?? 0) || 0;

export const parseCovidDate = (value: string) => parseDateValue(value) ?? new Date(value);

export const formatDate = (value: string) => {
  const parsed = parseDateValue(value);
  return parsed ? parsed.toLocaleDateString("pt-BR") : value;
};

export const formatNumber = (value: number) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

export const getMetricValue = (record: Pick<MunicipalityDay | StateDay, Metric>, metric: Metric) =>
  metric === "confirmed" ? record.confirmed : record.deaths;

export const metricLabel = (metric: Metric) => (metric === "confirmed" ? "Casos" : "Óbitos");

export const loadCities = async (): Promise<City[]> => {
  if (cache.cities) return cache.cities;

  const rows = await csv("/municipios.csv");
  cache.cities = rows.map((row) => ({
    code: numberFrom(row.city_ibge_code),
    name: row.city ?? "",
    latitude: numberFrom(row.latitude),
    longitude: numberFrom(row.longitude),
    stateCode: numberFrom(row.codigo_uf),
  }));

  return cache.cities;
};

export const loadTopology = async (scope: "brazil" | "parana"): Promise<Topology> => {
  const cacheKey = scope === "brazil" ? "brazilTopology" : "paranaTopology";
  if (cache[cacheKey]) return cache[cacheKey];

  const topology = await json<Topology>(scope === "brazil" ? "/map_br.json" : "/map_pr.json");
  if (!topology) {
    throw new Error(`Could not load ${scope} map topology`);
  }

  cache[cacheKey] = topology;
  return topology;
};

const parseMunicipalityDay = (row: DSVRowString<string>): MunicipalityDay => ({
  date: row.date ?? "",
  cityCode: numberFrom(row.z),
  confirmed: numberFrom(row.c),
  deaths: numberFrom(row.d),
});

export const loadMunicipalityDays = async (
  scope: "brazil" | "parana",
): Promise<MunicipalityDay[]> => {
  const cacheKey = scope === "brazil" ? "brazilMunicipalityDays" : "paranaMunicipalityDays";
  if (cache[cacheKey]) return cache[cacheKey];

  const rows = await csv(scope === "brazil" ? "/data/br_ndays.csv" : "/data/pr_ndays.csv");
  cache[cacheKey] = rows.map(parseMunicipalityDay);
  return cache[cacheKey];
};

export const loadParanaTopCityDays = async (): Promise<MunicipalityDay[]> => {
  if (cache.paranaTopCityDays) return cache.paranaTopCityDays;

  const rows = await csv("/data/pr_topcities_alldays.csv");
  cache.paranaTopCityDays = rows.map(parseMunicipalityDay);
  return cache.paranaTopCityDays;
};

export const loadStateDays = async (): Promise<StateDay[]> => {
  if (cache.stateDays) return cache.stateDays;

  const rows = await csv("/data/states_alldays.csv");
  cache.stateDays = rows.map((row) => ({
    date: row.date ?? "",
    state: row.state ?? "",
    confirmed: numberFrom(row.confirmed),
    deaths: numberFrom(row.deaths),
    confirmedPer100k: numberFrom(row.confirmed_per_100k_inhabitants),
  }));

  return cache.stateDays;
};

export const loadHeatmapPoints = async (scope: "brazil" | "parana"): Promise<HeatmapPoint[]> => {
  const cacheKey = scope === "brazil" ? "brazilHeatmap" : "paranaHeatmap";
  if (cache[cacheKey]) return cache[cacheKey];

  const rows = await csv(scope === "brazil" ? "/data/br_heatmap.csv" : "/data/pr_heatmap.csv");
  cache[cacheKey] = rows.map((row) => ({
    cityCode: numberFrom(row.z),
    confirmed: numberFrom(row.c),
  }));

  return cache[cacheKey];
};

export const preloadCovidData = async () => {
  await Promise.all([loadCities(), loadTopology("brazil"), loadTopology("parana")]);
};

export const indexByCityCode = <T extends { cityCode: number }>(rows: T[]) =>
  new Map(rows.map((row) => [row.cityCode, row]));

export const latestDate = <T extends { date: string }>(rows: T[]) =>
  rows.reduce((latest, row) => (row.date > latest ? row.date : latest), "");

export const rowsForDate = <T extends { date: string }>(rows: T[], date: string) =>
  rows.filter((row) => row.date === date);
