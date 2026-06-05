import * as d3 from "d3";
import { groups, least } from "d3-array";
import { useEffect, useRef, useState } from "react";
import { TabsGroup } from "./mapControls";

type Indicator = "confirmed" | "deaths" | "confirmed_per_100k_inhabitants";

type StateRow = {
  date: string;
  state: string;
  confirmed: number;
  deaths: number;
  confirmed_per_100k_inhabitants: number;
};

type StateSeries = {
  name: string;
  values: number[];
};

type ChartData = {
  y: string;
  series: StateSeries[];
  dates: Date[];
};

const indicatorOptions: { label: string; value: Indicator }[] = [
  { label: "casos", value: "confirmed" },
  { label: "mortes", value: "deaths" },
  { label: "casos/100 mil hab", value: "confirmed_per_100k_inhabitants" },
];

const colors = ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"];
const regionByState: Record<string, string> = {
  AC: "N",
  AL: "NE",
  AP: "N",
  AM: "N",
  BA: "NE",
  CE: "NE",
  DF: "CO",
  ES: "SE",
  GO: "CO",
  MA: "NE",
  MT: "CO",
  MS: "CO",
  MG: "SE",
  PA: "N",
  PB: "NE",
  PR: "S",
  PE: "NE",
  PI: "NE",
  RJ: "SE",
  RN: "NE",
  RS: "S",
  RO: "N",
  RR: "N",
  SC: "S",
  SP: "SE",
  SE: "NE",
  TO: "N",
};
const regionOrder = ["S", "SE", "CO", "N", "NE"];
const legendRegions = ["S", "SE", "CO", "NE", "N"];
const legendNames = ["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte"];
const parseDate = d3.utcParse("%Y-%m-%d");

const colorForState = (state: string) =>
  colors[regionOrder.indexOf(regionByState[state])] ?? colors[0];

const readDate = (value: string) => parseDate(value) ?? new Date(value);

const labelForIndicator = (indicator: Indicator) => {
  if (indicator === "confirmed_per_100k_inhabitants") return "Casos por 100 mil habitantes";
  if (indicator === "confirmed") return "Casos confirmados";
  return "Óbitos";
};

const buildChartData = (rows: StateRow[], indicator: Indicator): ChartData => {
  const dates = Array.from(d3.group(rows, (row) => row.date).keys(), readDate).sort(d3.ascending);
  const bisectDate = d3.bisector<StateRow, Date>((row) => readDate(row.date));

  return {
    y: labelForIndicator(indicator),
    series: groups(rows, (row) => row.state).map(([name, group]) => {
      const sortedGroup = group.sort((a, b) => d3.ascending(readDate(a.date), readDate(b.date)));

      return {
        name,
        values: dates.map((date) => {
          const index = bisectDate.left(sortedGroup, date);
          return index <= 0 ? 0 : sortedGroup[index - 1][indicator];
        }),
      };
    }),
    dates,
  };
};

const renderChart = (container: HTMLDivElement, rows: StateRow[], indicator: Indicator) => {
  const data = buildChartData(rows, indicator);
  const width = document.getElementById("states-daily-chart")?.clientWidth ?? 700;
  const height = document.getElementById("states-daily-chart")?.clientHeight ?? 400;
  const margin = { top: 40, right: 40, bottom: 40, left: 60 };

  const x = d3
    .scaleUtc()
    .domain(d3.extent(data.dates) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const y = d3
    .scaleSqrt()
    .domain([0, d3.max(data.series, (series) => d3.max(series.values)) ?? 0])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line<number>()
    .defined((value) => !Number.isNaN(value))
    .x((_, index) => x(data.dates[index]))
    .y((value) => y(value));

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]).style("overflow", "visible");

  const legend = svg
    .selectAll("g.region")
    .data(legendRegions)
    .enter()
    .append("g")
    .attr("class", "region")
    .attr("transform", (_, index) => `translate(100,${(1 + index) * 28})`);

  legend
    .append("rect")
    .attr("width", 22)
    .attr("height", 22)
    .attr("x", -28)
    .attr("y", 14)
    .style("fill", (region) => colors[legendRegions.indexOf(region)]);

  legend
    .append("text")
    .attr("y", 52 / 2)
    .attr("dy", ".35em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .text((_, index) => legendNames[index]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 90)
        .tickSizeOuter(0),
    );

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call((group) => group.select(".domain").remove())
    .call((group) =>
      group
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y),
    );

  const grid = svg.append("g").attr("stroke", "currentColor").attr("stroke-opacity", 0.05);

  grid
    .append("g")
    .selectAll("line")
    .data(x.ticks())
    .join("line")
    .attr("x1", (date) => 0.5 + x(date))
    .attr("x2", (date) => 0.5 + x(date))
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom);

  grid
    .append("g")
    .selectAll("line")
    .data(y.ticks())
    .join("line")
    .attr("y1", (value) => 0.5 + y(value))
    .attr("y2", (value) => 0.5 + y(value))
    .attr("x1", margin.left)
    .attr("x2", width - margin.right);

  const path = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", d3.rgb("#e54b4b").formatRgb())
    .attr("stroke-width", 2)
    .attr("stroke-miterlimit", 1)
    .selectAll<SVGPathElement, StateSeries>("path")
    .data(data.series)
    .join("path")
    .style("mix-blend-mode", "multiply")
    .attr("d", (series) => line(series.values));

  const dot = svg.append("g");
  dot.append("circle").attr("r", 2.5);
  dot
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "600")
    .attr("font-size", "12px")
    .style("paint-order", "stroke")
    .style("stroke-width", "3")
    .style("stroke", "rgba(255,255,255,.85)")
    .style("stroke-linecap", "round")
    .style("stroke-linejoin", "round")
    .style("paint-order", "stroke")
    .attr("stroke-width", "0.4px")
    .attr("text-anchor", "middle")
    .attr("y", -12);

  const showHover = (series: StateSeries, index: number) => {
    path.attr("stroke", (pathSeries) =>
      pathSeries === series ? "#555555" : colorForState(pathSeries.name),
    );
    dot.attr("transform", `translate(${x(data.dates[index])},${y(series.values[index])})`);
    const value =
      indicator === "confirmed_per_100k_inhabitants"
        ? series.values[index].toFixed(2)
        : series.values[index];
    dot.select("text").text(`${series.name}: ${value}`);
  };

  const showDefaultHover = () => {
    const index = data.dates.length - 1;
    const series = data.series.find((item) => item.name === "PR") ?? data.series[0];
    showHover(series, index);
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const source =
      "touches" in event && event.touches[0] ? event.touches[0] : (event as MouseEvent);
    const point = d3.pointer(source, svg.node());
    const ym = y.invert(point[1]);
    const xm = x.invert(point[0]);
    const nextIndex = d3.bisectLeft(data.dates, xm, 1);
    const previousIndex = nextIndex - 1;
    const index =
      nextIndex >= data.dates.length ||
      xm.getTime() - data.dates[previousIndex].getTime() >
        data.dates[nextIndex].getTime() - xm.getTime()
        ? Math.min(nextIndex, data.dates.length - 1)
        : previousIndex;
    const series = least(data.series, (item) => Math.abs(item.values[index] - ym));
    if (series) showHover(series, index);
  };

  if ("ontouchstart" in document) {
    svg
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchstart", handleMove)
      .on("touchend", showDefaultHover);
  } else {
    svg.on("mousemove mouseenter", handleMove).on("mouseleave", showDefaultHover);
  }

  showDefaultHover();
  container.replaceChildren(svg.node() as SVGSVGElement);
};

export default function DailyLinesBrazil() {
  const [indicator, setIndicator] = useState<Indicator>("deaths");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    d3.csv("/data/states_alldays.csv", (row) => ({
      date: row.date ?? "",
      state: row.state ?? "",
      confirmed: Number(row.confirmed),
      deaths: Number(row.deaths),
      confirmed_per_100k_inhabitants: Number(row.confirmed_per_100k_inhabitants),
    })).then((rows) => {
      if (isMounted && chartRef.current) renderChart(chartRef.current, rows, indicator);
    });

    return () => {
      isMounted = false;
    };
  }, [indicator]);

  return (
    <div>
      <div>
        <div className="flex flex-row flex-wrap items-center justify-center">
          <div className="m-2 flex h-8 items-center">
            <TabsGroup
              label="Selecionar indicador"
              options={indicatorOptions}
              value={indicator}
              onChange={setIndicator}
            />
          </div>
        </div>

        <div id="states-daily-chart" ref={chartRef} className="h-[400px]" />
      </div>
    </div>
  );
}
