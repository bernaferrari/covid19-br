import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DailyMapData,
  loadBrazilDailyMapData,
  renderBrazilSpikeMap,
} from "./dailyMapRenderers";
import { DateScrubber, type CaseMetric, metricOptions, TabsGroup } from "./mapControls";

type ScaleType = "bolhas" | "espinhos";

const scaleOptions: { label: string; value: ScaleType }[] = [
  { label: "bolhas", value: "bolhas" },
  { label: "espinhos", value: "espinhos" },
];

export default function DailyMapSpikesBrazil() {
  const [metric, setMetric] = useState<CaseMetric>("c");
  const [scaleType, setScaleType] = useState<ScaleType>("espinhos");
  const [index, setIndex] = useState(0);
  const [mapData, setMapData] = useState<DailyMapData | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleIndexChange = useCallback((value: number) => setIndex(value), []);

  useEffect(() => {
    let isMounted = true;

    loadBrazilDailyMapData().then((data) => {
      if (isMounted) setMapData(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && mapData) {
      renderBrazilSpikeMap(mapRef.current, mapData, metric, scaleType, index);
    }
  }, [index, mapData, metric, scaleType]);

  return (
    <div className="Map">
      <div id="observablehq-3176bb0d">
        <div className="flex flex-row flex-wrap items-center justify-center">
          <div className="m-2 flex h-8 items-center observablehq-viewof-confirmed_or_deaths">
            <TabsGroup
              label="Selecionar métrica"
              options={metricOptions}
              value={metric}
              onChange={setMetric}
            />
          </div>
          <div className="m-2 flex h-8 items-center observablehq-viewof-scale">
            <TabsGroup
              label="Selecionar escala do mapa"
              options={scaleOptions}
              value={scaleType}
              onChange={setScaleType}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center">
          <div className="mt-2 mb-8 flex h-8 w-fit items-center rounded-lg border px-0.5 observablehq-viewof-day">
            {mapData ? (
              <DateScrubber dates={mapData.dates} index={index} onChange={handleIndexChange} />
            ) : null}
          </div>
        </div>

        <div ref={mapRef} className="observablehq-map" />
        <div className="observablehq-style" style={{ display: "none" }} />
        <div className="observablehq-draw" style={{ display: "none" }} />
        <div className="observablehq-indexSetter" style={{ display: "none" }} />
      </div>
    </div>
  );
}
