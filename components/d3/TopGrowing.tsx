import * as d3 from "d3";
import { group } from "d3-array";
import { useEffect, useRef } from "react";
import { getCitiesCSV } from "../../utils/fetcher";

type CityRecord = Awaited<ReturnType<typeof getCitiesCSV>>[number];

type TopCityRow = {
  city_ibge_code: number;
  confirmed: number;
  deaths: number;
  date: string;
  new?: number;
  weeklyAvg?: number;
};

type CitySeries = TopCityRow[] & {
  stack?: DeathsStack[];
};

type DeathsStack = d3.Series<TopCityRow, string> & {
  y?: [number, number];
};

const number = d3.format(",.2~f");
const parseDate = d3.utcParse("%Y-%m-%d");
const colors = d3
  .scaleOrdinal<string, string>()
  .domain(["recovered", "deaths", "confirmed", "new"])
  .range(["#25c45b", "#c9166a", "#ff9500", "#808080"]);

const movingAverage = (data: TopCityRow[], accessor: keyof TopCityRow, window = 7) =>
  Array.from({ length: Math.floor(data.length) }, (_, index) => {
    const width = index + window < data.length ? window : data.length - index;
    const sum = d3.sum(data.slice(index - width, index), (row) => Number(row[accessor] ?? 0));
    const row = data[index];
    row.weeklyAvg = sum / width;
    return row;
  });

const drawStack = (
  svg: d3.Selection<SVGGElement, CitySeries, Element, unknown>,
  width: number,
  height: number,
) => {
  const yScale = d3.scaleLinear().range([height, 0]);
  const xScale = d3.scaleTime().range([0, width]);
  const date = (value: string) => parseDate(value) ?? new Date(value);

  const area = d3
    .area<d3.SeriesPoint<TopCityRow>>()
    .x((row) => xScale(date(row.data.date)))
    .y0((row) => yScale(row[0]))
    .y1((row) => yScale(row[1]))
    .curve(d3.curveStepBefore);

  const group = svg.append("g");

  group
    .selectAll("path")
    .data((series) => {
      yScale.domain([0, d3.max(series, (row) => row.confirmed) ?? 0]);
      xScale.domain(d3.extent(series, (row) => date(row.date)) as [Date, Date]);
      if (series.stack?.[0]) {
        series.stack[0].y = yScale.domain() as [number, number];
      }
      return series.stack ?? [];
    })
    .join("path")
    .attr("d", (series) => {
      yScale.domain(series.y ?? [0, 0]);
      return area(series);
    })
    .attr("fill", ({ key }) => colors(key));
};

const drawChart = (
  svg: d3.Selection<SVGGElement, CitySeries, Element, unknown>,
  metric: "confirmed" | "new",
  color: string,
  width: number,
  height: number,
) => {
  const yScale = d3.scaleLinear().range([height, 0]);
  const xScale = d3.scaleTime().range([0, width]);
  const date = (value: string) => parseDate(value) ?? new Date(value);

  const valueFor = (row: TopCityRow) => Number(row[metric === "new" ? "new" : "confirmed"] ?? 0);
  const area = d3
    .area<TopCityRow>()
    .x((row) => xScale(date(row.date)))
    .y0((row) => yScale(Number(row[metric] ?? 0)))
    .y1(height)
    .curve(d3.curveStepBefore);
  const line = d3
    .line<TopCityRow>()
    .x((row) => xScale(date(row.date)))
    .y((row) => yScale(Number(row[metric] ?? 0)))
    .curve(d3.curveStepBefore);
  const averageLine = d3
    .line<TopCityRow>()
    .x((row) => xScale(date(row.date)))
    .y((row) => yScale(row.weeklyAvg ?? 0))
    .curve(d3.curveCardinal);
  const xAxis = d3.axisBottom(xScale).ticks(3);
  const group = svg.append("g");

  group
    .append("path")
    .attr("d", (series) => {
      yScale.domain([0, d3.max(series, valueFor) ?? 0]);
      xScale.domain(d3.extent(series, (row) => date(row.date)) as [Date, Date]);
      return area(series);
    })
    .attr("fill", color)
    .attr("fill-opacity", 0.2);

  group
    .append("path")
    .attr("d", (series) => {
      yScale.domain([0, d3.max(series, valueFor) ?? 0]);
      xScale.domain(d3.extent(series, (row) => date(row.date)) as [Date, Date]);
      return line(series);
    })
    .attr("stroke", color)
    .attr("fill", "none");

  if (metric === "new") {
    group
      .append("path")
      .attr("d", (series) => {
        yScale.domain([0, d3.max(series, (row) => row.new ?? 0) ?? 0]);
        return averageLine(series);
      })
      .attr("stroke", "#505050")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }

  const axis = group.append("g").call(xAxis).attr("transform", `translate(0,${height})`);
  axis.select(".domain").remove();
  axis.selectAll(".tick text").attr("fill", "#999");
  axis.selectAll(".tick line").attr("stroke", "#999");
};

const loadTopGrowingData = async () => {
  const [rows, cities] = await Promise.all([
    d3.csv("/data/pr_topcities_alldays.csv", (row) => ({
      city_ibge_code: Number(row.z),
      confirmed: Number(row.c),
      deaths: Number(row.d),
      date: row.date ?? "",
    })) as Promise<TopCityRow[]>,
    getCitiesCSV(),
  ]);

  const groupedByDate = Array.from(
    group(rows, (row) => row.date),
    ([, value]) => value,
  )
    .sort(() => 0)
    .reverse();
  const groupedByCity = Array.from(
    group(groupedByDate.flat(), (row) => `${row.city_ibge_code}`),
    ([, value]) => value,
  );

  const series = groupedByCity.map((cityRows) => {
    cityRows.forEach((row, index) => {
      row.new = index > 0 ? row.confirmed - cityRows[index - 1].confirmed : 0;
    });
    return cityRows.sort((a, b) => a.date.localeCompare(b.date)) as CitySeries;
  });

  const stacks = series.map((cityRows) => d3.stack<TopCityRow>().keys(["deaths"])(cityRows));
  const allTimeseries = series.map((cityRows) => {
    const city = cityRows[0].city_ibge_code;
    cityRows.stack = stacks.find((stack) => stack[0][0].data.city_ibge_code === city);
    movingAverage(cityRows, "new");
    return cityRows;
  });

  return { allTimeseries, cities };
};

const cityNameFor = (cities: CityRecord[], cityCode: number) =>
  cities.find((city) => city.city_ibge_code === cityCode)?.city ?? String(cityCode);

const TopGrowing = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    loadTopGrowingData().then(({ allTimeseries, cities }) => {
      if (!isMounted || !rootRef.current) return;

      const width = document.getElementById("top-growing-chart")?.clientWidth ?? 700;
      const columns = width / 150 > 4 ? 4 : 2;
      const padding = 4;
      const chartWidth = width / columns - padding * 2;
      const chartHeight = chartWidth * 0.25;
      const limit = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 4 : 8;
      const dataFacets = allTimeseries
        .sort((a, b) => b[b.length - 1].confirmed - a[a.length - 1].confirmed)
        .slice(0, limit);

      const container = d3.select(rootRef.current).style("font-family", "sans-serif");
      container.selectAll("*").remove();

      const facets = container
        .selectAll<HTMLDivElement, CitySeries>("div")
        .data(dataFacets)
        .join("div")
        .style("width", `${chartWidth}px`)
        .style("display", "inline-block")
        .style("text-align", "left")
        .style("background", "#fff")
        .style("margin", `0 ${padding}px ${padding}px 0`)
        .style("padding", `${padding * 2}px ${padding}px ${padding}px ${padding}px`);

      facets
        .append("h4")
        .style("font-size", ".9em")
        .style("font-weight", "bold")
        .html((rows) => cityNameFor(cities, rows[0].city_ibge_code));

      facets
        .append("p")
        .style("font-size", ".8em")
        .style("color", "#808080")
        .style("margin-bottom", 0)
        .html(
          (rows) =>
            `<span style="font-size:1.2em;font-weight:bold;color:#ff9500">${number(
              rows[rows.length - 1].confirmed,
            )}</span> casos confirmados`,
        );

      facets
        .append("p")
        .style("font-size", ".8em")
        .style("color", "#808080")
        .style("margin-bottom", 0)
        .html(
          (rows) =>
            `<span style="font-size:1.2em;font-weight:bold;color:#c9166a">${number(
              rows[rows.length - 1].deaths,
            )}</span> mortes`,
        );

      const chartsTop = facets
        .append("svg")
        .attr("viewBox", [0, -1, chartWidth, 2 * chartHeight + padding * 2 + 12]);

      drawChart(chartsTop.append("g"), "confirmed", "#ff9500", chartWidth, 2 * chartHeight);
      drawStack(chartsTop.append("g"), chartWidth, 2 * chartHeight);

      const chartsNew = facets
        .append("svg")
        .attr("viewBox", [0, -1, chartWidth, chartHeight + padding * 2 + 12]);

      drawChart(chartsNew.append("g"), "new", "#808080", chartWidth, chartHeight);

      facets
        .append("p")
        .style("font-size", ".7em")
        .style("color", "#999")
        .style("margin-bottom", 0)
        .style("line-height", 1.2)
        .html(
          'A <span style="color:#505050; font-weight: bold">linha cinza grossa</span> mostra a média semanal dos casos diários',
        );
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div>
        <div ref={rootRef} />
      </div>
    </div>
  );
};

export default TopGrowing;
