import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DailyMapData,
  loadBrazilDailyMapData,
  renderBrazilSpikeMap,
} from "./dailyMapRenderers";
import { DateScrubberControl, type CaseMetric, metricOptions, TabsGroup } from "./mapControls";

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

  const title = metric === "c" ? "Casos confirmados no Brasil" : "Óbitos no Brasil";

  return (
    <div>
      <div>
        <h2 className="mb-5 text-center text-sm font-semibold">{title}</h2>
        <div className="mb-8 flex flex-row flex-wrap items-center justify-center gap-3">
          <div className="flex h-8 items-center">
            <TabsGroup
              label="Selecionar métrica"
              options={metricOptions}
              value={metric}
              onChange={setMetric}
            />
          </div>
          <div className="flex h-8 items-center">
            <TabsGroup
              label="Selecionar escala do mapa"
              options={scaleOptions}
              value={scaleType}
              onChange={setScaleType}
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

        <div ref={mapRef} />
      </div>
    </div>
  );
}
