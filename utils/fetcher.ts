import { csv, json } from "d3";

type CityRecord = {
  latitude: number;
  longitude: number;
  city_ibge_code: number;
  codigo_uf: number;
  city: string;
};

type CachedData = {
  cities?: CityRecord[];
  [key: string]: unknown;
};

const cached: CachedData = {};

export const loadDataIntoCache = async (): Promise<CachedData> => {
  if (cached.cities) {
    return cached;
  }

  await Promise.all([getCitiesCSV(), getMapFrom("map_br"), getMapFrom("map_pr")]);

  return cached;
};

export const getCitiesCSV = async (): Promise<CityRecord[]> => {
  if (cached.cities) {
    return cached.cities;
  }

  const cities = await csv("/municipios.csv");

  cached.cities = cities.map((d) => ({
    latitude: Number(d.latitude),
    longitude: Number(d.longitude),
    city_ibge_code: Number(d.city_ibge_code),
    codigo_uf: Number(d.codigo_uf),
    city: d.city ?? "",
  }));

  return cached.cities;
};

export const getMapFrom = async (place: string): Promise<unknown> => {
  if (cached[place]) {
    return cached[place];
  }

  const data = await json(`/${place}.json`);
  cached[place] = data;
  return data;
};
