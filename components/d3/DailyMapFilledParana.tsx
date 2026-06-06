import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DailyMapData,
  loadParanaDailyMapData,
  renderParanaFilledMap,
} from "./dailyMapRenderers";
import { DateScrubberControl, type CaseMetric, metricOptions, TabsGroup } from "./mapControls";

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

  const title = metric === "c" ? "Casos confirmados no Paraná" : "Óbitos no Paraná";

  return (
    <div>
      <div>
        <h2 className="mb-5 text-center text-sm font-semibold">{title}</h2>
        <div className="mb-3 flex flex-row flex-wrap items-center justify-center gap-3">
          <div className="flex h-8 items-center">
            <TabsGroup
              label="Selecionar métrica"
              options={metricOptions}
              value={metric}
              onChange={setMetric}
            />
          </div>
          {mapData ? (
            <DateScrubberControl
              dates={mapData.dates}
              index={index}
              onChange={handleIndexChange}
            />
          ) : null}
        </div>
        <div className="flex items-center justify-center">
          <div ref={legendRef} />
        </div>
        <div ref={mapRef} />
      </div>
    </div>
  );
}
