import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DailyMapData,
  loadParanaDailyMapData,
  renderParanaFilledMap,
} from "./dailyMapRenderers";
import { DateScrubber, type CaseMetric, metricOptions, RadioGroup } from "./mapControls";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
  margin: 12px;
`;

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
        <Container>
          <Flex
            rounded={8}
            borderWidth="1px"
            pl={4}
            m={4}
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
            w={380}
            minH={10}
            rounded={8}
            align="center"
            borderWidth="1px"
            pr={4}
            className="observablehq-viewof-day"
          >
            {mapData ? (
              <DateScrubber dates={mapData.dates} index={index} onChange={handleIndexChange} />
            ) : null}
          </Flex>
        </Container>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div ref={legendRef} className="observablehq-colorlegend" />
        </div>
        <div ref={mapRef} className="observablehq-map_spike" />
        <div className="observablehq-style" style={{ display: "none" }} />
        <div className="observablehq-indexSetter" style={{ display: "none" }} />
      </div>
    </div>
  );
}
