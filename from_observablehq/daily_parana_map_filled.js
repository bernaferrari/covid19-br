// https://observablehq.com/@bernaferrari/parana-coronavirus-daily-cases-map-covid-19@2389
import define1 from "./shared_d3/scrubber";
import define2 from "./shared_d3/inputs";
import define3 from "./shared_d3/colorlegend";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { getCitiesCSV, getMapFrom } from "./../utils/fetcher";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md", "dates"], function (md, dates) {
    return md`# Paraná Coronavirus Daily Cases Map (COVID-19)

Dados entre: ${dates[0].toLocaleDateString()} e ${dates[dates.length - 1].toLocaleDateString()}.

*Fonte: [covid19-br](https://brasil.io/api/dataset/covid19)*`;
  });
  main.variable(observer("viewof confirmed_or_deaths")).define("viewof confirmed_or_deaths", ["radio"], function (radio) {
    return (
      radio({
        options: [
          { label: "casos", value: "c" },
          { label: "mortes", value: "d" },
        ],
        value: "c",
      })
    )
  });
  main.variable(observer("confirmed_or_deaths")).define("confirmed_or_deaths", ["Generators", "viewof confirmed_or_deaths"], (G, _) => G.input(_));
  main.variable(observer("viewof day")).define("viewof day", ["Scrubber", "dates", "delay"], function (Scrubber, dates, delay) {
    return (
      Scrubber(dates.slice(0, dates.length), {
        delay,
        loop: false,
        format: d => d.toLocaleDateString()
      })
    )
  });
  main.variable(observer("day")).define("day", ["Generators", "viewof day"], (G, _) => G.input(_));
  main.variable(observer("colorlegend")).define("colorlegend", ["confirmed_or_deaths", "legend", "colorScaleFilled"], function (confirmed_or_deaths, legend, colorScaleFilled) {
    if (confirmed_or_deaths === 'c') {
      return legend({
        color: colorScaleFilled,
        title: "Casos confirmados",
        ticks: 3,
      })
    } else if (confirmed_or_deaths === 'd') {
      return legend({
        color: colorScaleFilled,
        title: "Mortes",
        ticks: 3,
      })
    }
  }
  );
  main.variable(observer("colorScaleFilled")).define("colorScaleFilled", ["d3", "confirmed_or_deaths", "maxCases"], function (d3, confirmed_or_deaths, maxCases) {
    return (
      d3.scaleSequentialSqrt(confirmed_or_deaths === "c" ? d3.interpolateYlGnBu : d3.interpolateYlOrRd)
        .domain([0, maxCases])
    )
  });
  main.variable(observer("map_spike")).define("map_spike", ["d3", "w", "h", "statesOuter", "path", "estado", "currentData", "confirmed_or_deaths", "colorScaleFilled", "places", "projection", "html"], function (d3, w, h, statesOuter, path, estado, currentData, confirmed_or_deaths, colorScaleFilled, places, projection, html) {
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, w, h])
      .attr("class", "italy");

    svg.append("path")
      .datum(statesOuter)
      .attr("class", "outer")
      .attr("d", path)
      .attr("id", "usPath")
      .attr("stroke", "grey")
      .attr('stroke-width', '1px')

    svg
      .selectAll(".subunit")
      .data(estado.features)
      .enter()
      .append("path")
      .attr("stroke", "#BBB")
      .attr("class", "county")
      .style('stroke-width', d => {
        let index = currentData.findIndex(dd => dd.z === d.properties.cod);
        let value = currentData[index] ? currentData[index][confirmed_or_deaths] : 0;

        return value > 0 ? "0px" : "0.25px";
      })
      .attr("fill", d => {
        let index = currentData.findIndex(dd => dd.z == d.properties.cod);
        let value = currentData[index] ? currentData[index][confirmed_or_deaths] : 0;

        return value > 0 ? colorScaleFilled(value) : "#fff";
        // return colorScaleFilled(value);
      })
      .attr("d", path)
      .append("title")
      .text(
        d => {
          let index = currentData.findIndex(dd => dd.z == d.properties.cod);
          let value = currentData[index] ? currentData[index][confirmed_or_deaths] : 0;
          return `${value}`;
        }
      );

    // let label = svg
    //   .selectAll(".place-label")
    //   .data(places.features)
    //   .enter()
    //   .append("text")
    //   .attr("class", "place-label2")
    //   .style('paint-order', 'stroke')
    //   .style('stroke-width', '3')
    //   .style('stroke', 'rgba(255,255,255,.85)')
    //   .style('stroke-linecap', 'round')
    //   .style('stroke-linejoin', 'round')
    //   .attr("transform", function (d) {
    //     return "translate(" + projection(d.geometry.coordinates) + ")";
    //   })
    //   .attr("dy", ".35em")
    //   .text(function (d) {
    //     return d.properties.name;
    //   })
    //   .attr("pointer-events", "none")
    //   .attr("x", function (d) {
    //     return d.geometry.coordinates[0] > -1 ? -6 : 6;
    //   })
    //   .style("text-anchor", function (d) {
    //     return d.geometry.coordinates[0] < -1 ? "start" : "end";
    //   });

    // label.append("tspan")
    //   .attr("class", "additionalnum")
    //   .style('font-weight', 'bold')
    //   .attr("x", d => label.x)
    //   .attr("y", d => label.y)
    //   .text(d => {
    //     let index = currentData.findIndex(dd => dd.z == d.properties.cod);
    //     let value = currentData[index] ? currentData[index][confirmed_or_deaths] : 0;

    //     return " (" + value + ")";
    //   })

    const wrapper = html`<div class="wrapper"></div>`;
    wrapper.append(svg.node());
    return wrapper;
  }
  );
  main.variable(observer("currentData")).define("currentData", ["data", "index"], function (data, index) {
    return (
      data[Object.keys(data)[Object.keys(data).length - 1 - index]]
    )
  });
  main.variable(observer("style")).define("style", ["html"], function (html) {
    const c = `rgb(255, 255, 255, 0.5)`;
    return html`<style>
      .wrapper {
        text-align: center;
      }
      .italy {
        text-anchor: middle;
        font-family: sans-serif;
        font-size: 10px;
        margin: 0 auto;
      }
      .place {
        fill: rgba(0, 0, 0, 0.8);
        stroke: none;
      }
      .place-label,
      .legend-title {
        font-weight: bold;
        font-size: 13px;
        fill: rgba(0, 0, 0, 0.8);
      }
      .place-label {
        text-shadow: ${c} 1px 0px 0px, ${c} 0.540302px 0.841471px 0px,
          ${c} -0.416147px 0.909297px 0px, ${c} -0.989992px 0.14112px 0px,
          ${c} -0.653644px -0.756802px 0px, ${c} 0.283662px -0.958924px 0px,
          ${c} 0.96017px -0.279415px 0px;
      }
    </style>`;
  });
  main
    .variable(observer("projection"))
    .define("projection", ["d3", "w", "h", "estado"], function (
      d3,
      w,
      h,
      estado
    ) {
      return d3.geoMercator().fitExtent(
        [
          [20, 0],
          [w - 20, h],
        ],
        estado
      );
    });
  main.variable(observer("showSubtitles")).define("showSubtitles", function () {
    return false;
  });
  main.define("initial index", function () {
    return 0;
  });
  main
    .variable(observer("mutable index"))
    .define("mutable index", ["Mutable", "initial index"], (M, _) => new M(_));
  main
    .variable(observer("index"))
    .define("index", ["mutable index"], (_) => _.generator);
  main.variable(observer("w")).define("w", ["width"], function (width) {
    return Math.min(width, 700);
  });
  main.variable(observer("h")).define("h", ["width"], function (width) {
    return Math.min(width, 400);
  });
  main
    .variable(observer("maxLegend"))
    .define("maxLegend", ["maxCases", "magnitude"], function (
      maxCases,
      magnitude
    ) {
      return Math.round(maxCases / magnitude) * magnitude;
    });
  main
    .variable(observer("magnitude"))
    .define("magnitude", ["toMagnitude", "maxCases"], function (
      toMagnitude,
      maxCases
    ) {
      return toMagnitude(maxCases);
    });
  main.variable(observer("toMagnitude")).define("toMagnitude", function () {
    return function toMagnitude(n) {
      var order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
      return Math.pow(10, order);
    };
  });
  main
    .variable(observer("indexSetter"))
    .define("indexSetter", ["mutable index", "dates", "day"], function (
      $0,
      dates,
      day
    ) {
      $0.value = dates.indexOf(day);
    });
  main
    .variable(observer("colorScale"))
    .define("colorScale", ["d3", "maxCases"], function (d3, maxCases) {
      return d3
        .scaleSqrt()
        .domain([0, maxCases])
        .range([`hsla(57, 100%, 50%, 0.36)`, `hsla(7, 100%, 50%, 0.57)`]);
    });
  main.variable(observer("delay")).define("delay", function () {
    return 200;
  });
  main.variable(observer("maxCases")).define("maxCases", ["data", "d3", "confirmed_or_deaths"], function (data, d3, confirmed_or_deaths) {
    var highestValue = 0; //keep track of highest value

    //loop through array of objects
    for (let key in data) {
      var value = d3.max(data[key], d => d[confirmed_or_deaths]);
      if (value > highestValue) {
        highestValue = value;
      }
    }
    return highestValue;
  }
  );
  main.variable(observer("data_city")).define("data_city", async function () {
    return (await getCitiesCSV()).filter(d => d.codigo_uf === 41);
  });
  main.variable(observer("data")).define("data", ["d3"], async function (d3) {
    return d3.nest().key(d => d.date).object(await d3.csv("/data/pr_ndays.csv", d => {
      d["z"] = +d["z"];
      d["c"] = +d["c"];
      d["d"] = +d["d"];
      return d;
    }));
  });
  main.variable(observer("breakpoint")).define("breakpoint", function () {
    return 500;
  });
  main.variable(observer("topCities")).define("topCities", ["data", "confirmed_or_deaths"], function (data, confirmed_or_deaths) {
    let mostRecent = data[Object.keys(data)[0]];

    // clone and sort
    return mostRecent.slice(0).sort((a, b) => b[confirmed_or_deaths] - a[confirmed_or_deaths]).slice(0, 5);
  }
  );
  main.variable(observer("places")).define("places", ["topCities", "estado", "data_city"], function (topCities, estado, data_city) {
    let topCitiesFlat = topCities.map(d => d.z);
    let updatedArray = [];
    for (var i = 0; i < estado.features.length; i++) {
      let flatIndex = topCitiesFlat.indexOf(estado.features[i].properties.cod);

      if (flatIndex > -1) {
        let city = data_city.find(d => d.city_ibge_code === topCities[flatIndex].z);

        let features = { ...estado.features[i] };
        features.properties = {
          "name": city.city,
          "cod": city.city_ibge_code
        };
        features.geometry = {
          "type": "Point",
          "coordinates": [city.longitude, city.latitude]
        };
        updatedArray.push(features);
      }
    }

    return {
      "type": "FeatureCollection",
      "features": updatedArray
    };
  }
  );
  main.variable(observer("recentData")).define("recentData", ["data"], function (data) {
    return (
      data[Object.keys(data)[0]]
    )
  });
  main.variable(observer("dates")).define("dates", ["data", "parseDate"], function (data, parseDate) {
    return (
      Object.keys(data).map(d => parseDate(d)).reverse()
    )
  });
  main.variable(observer("parseDate")).define("parseDate", ["d3"], function (d3) {
    return (
      d3.utcParse("%Y-%m-%d")
    )
  });
  main.variable(observer("estado")).define("estado", ["topojson", "brasil"], function (topojson, brasil) {
    return (
      topojson.feature(brasil, brasil.objects["41"])
    )
  });
  main.variable(observer("statesOuter")).define("statesOuter", ["topojson", "brasil"], function (topojson, brasil) {
    return (
      topojson.mesh(brasil, brasil.objects["41"], (a, b) => a === b)
    )
  });
  main.variable(observer("statesInner")).define("statesInner", ["topojson", "brasil"], function (topojson, brasil) {
    return (
      topojson.mesh(brasil, brasil.objects["41"], (a, b) => a !== b)
    )
  });
  main.variable(observer("path")).define("path", ["d3", "projection"], function (d3, projection) {
    return (
      d3.geoPath().projection(projection)
    )
  });
  main.variable(observer("brasil")).define("brasil", async function () {
    return await getMapFrom("map_pr");
  });
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("radio", child2);
  const child3 = runtime.module(define3);
  main.import("legend", child3);
  main.variable(observer("topojson")).define("topojson", topojson);
  main.variable(observer("d3")).define("d3", d3);
  return main;
}
