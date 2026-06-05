import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DailyMapData,
  loadParanaDailyMapData,
  renderParanaFilledMap,
} from "./dailyMapRenderers";
import { DateScrubber, type CaseMetric, metricOptions, RadioGroup } from "./mapControls";

export default function DailyMapFilledParana() {
  const [metric, setMetric] = useState<CaseMetric>("c");
  const [index, setIndex] = useState(0);
  const [mapData, setMapData] = useState<DailyMapData | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const handleIndexChange = useCallback((value: number) => setIndex(value), []);

  useEffect(() => {
    let isMounted = true;

    loadParanaDailyMapData().then((data) => {
      if (isMounted) setMapData(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && mapData) {
      renderParanaFilledMap(mapRef.current, legendRef.current, mapData, metric, index);
    }
  }, [index, mapData, metric]);

  return (
    <div className="App">
      <div id="observablehq-cf886714">
        <div className="m-3 flex flex-row flex-wrap items-center justify-center">
          <div className="m-4 flex min-h-10 items-center rounded-lg border pl-4 observablehq-viewof-confirmed_or_deaths">
            <RadioGroup
              name="confirmed_or_deaths"
              options={metricOptions}
              value={metric}
              onChange={setMetric}
            />
          </div>
          <div className="flex min-h-10 w-[380px] items-center rounded-lg border pr-4 observablehq-viewof-day">
            {mapData ? (
              <DateScrubber dates={mapData.dates} index={index} onChange={handleIndexChange} />
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div ref={legendRef} className="observablehq-colorlegend" />
        </div>
        <div ref={mapRef} className="observablehq-map_spike" />
        <div className="observablehq-style" style={{ display: "none" }} />
        <div className="observablehq-indexSetter" style={{ display: "none" }} />
      </div>
    </div>
  );
}
