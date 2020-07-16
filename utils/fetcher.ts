import { DSVRowArray, csv, json } from "d3";

const cached: Object = {};
export const loadDataIntoCache = async (): Promise<any> => {
  if (cached !== undefined && cached["cities"] !== undefined) {
    return cached;
  }

  // fetch in parallel
  await Promise.all([
    getCitiesCSV(),
    getMapFrom("map_br"),
    getMapFrom("map_pr"),
  ]);

  return cached;
};

export let cityFromCode: Map<Number, String> = new Map();

export const getCitiesCSV = async (): Promise<DSVRowArray> => {
  if (cached["cities"] !== undefined) {
    return cached["cities"];
  }
  const cities = await csv("/municipios.csv");

  cached["cities"] = cities.map((d) => {
    return {
      latitude: +d["latitude"],
      longitude: +d["longitude"],
      city_ibge_code: +d["city_ibge_code"],
      codigo_uf: +d["codigo_uf"],
      city: d["city"],
    };
  });

  return cached["cities"];
};

export const getMapFrom = async (place: string): Promise<DSVRowArray> => {
  if (cached[place] !== undefined) {
    return cached[place];
  }
  cached[place] = await json(`/${place}.json`);
  return cached[place];
};
