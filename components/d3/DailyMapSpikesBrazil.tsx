import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DailyMapData,
  loadBrazilDailyMapData,
  renderBrazilSpikeMap,
} from "./dailyMapRenderers";
import { DateScrubber, type CaseMetric, metricOptions, RadioGroup } from "./mapControls";

type ScaleType = "bolhas" | "espinhos";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
`;

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
        <Container>
          <Flex
            rounded={8}
            borderWidth="1px"
            pl={4}
            m={2}
            minH={10}
            className="observablehq-viewof-confirmed_or_deaths"
            align="center"
          >
            <RadioGroup
              name="confirmed_or_deaths"
              options={metricOptions}
              value={metric}
              onChange={setMetric}
            />
          </Flex>
          <Flex
            rounded={8}
            borderWidth="1px"
            pl={4}
            m={2}
            minH={10}
            className="observablehq-viewof-scale"
            align="center"
          >
            <RadioGroup
              name="scale"
              options={scaleOptions}
              value={scaleType}
              onChange={setScaleType}
            />
          </Flex>
        </Container>
        <Container>
          <Flex
            w={380}
            h={10}
            rounded={8}
            mt={2}
            mb={8}
            align="center"
            borderWidth="1px"
            className="observablehq-viewof-day"
          >
            {mapData ? (
              <DateScrubber dates={mapData.dates} index={index} onChange={handleIndexChange} />
            ) : null}
          </Flex>
        </Container>

        <div ref={mapRef} className="observablehq-map" />
        <div className="observablehq-style" style={{ display: "none" }} />
        <div className="observablehq-draw" style={{ display: "none" }} />
        <div className="observablehq-indexSetter" style={{ display: "none" }} />
      </div>
    </div>
  );
}
