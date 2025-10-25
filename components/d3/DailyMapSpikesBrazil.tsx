import React, { Component } from "react";
import type { Runtime } from "@observablehq/runtime";
import { Inspector } from "@observablehq/inspector";
import notebook from "../../from_observablehq/daily_brazil_map_spikes";
import styled from "@emotion/styled";
import { Flex } from "@chakra-ui/react";
import { createRuntime } from "../../utils/observableRuntime";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
`;

export default class Map extends Component {
  private runtime?: Runtime;

  componentDidMount() {
    this.runtime = createRuntime();
    this.runtime.module(notebook, (name: string) => {
      if (name === "viewof confirmed_or_deaths")
        return Inspector.into(
          "#observablehq-3176bb0d .observablehq-viewof-confirmed_or_deaths"
        )();
      if (name === "viewof scale")
        return Inspector.into(
          "#observablehq-3176bb0d .observablehq-viewof-scale"
        )();
      if (name === "viewof day")
        return Inspector.into(
          "#observablehq-3176bb0d .observablehq-viewof-day"
        )();
      if (name === "map")
        return Inspector.into("#observablehq-3176bb0d .observablehq-map")();
      if (name === "style")
        return Inspector.into("#observablehq-3176bb0d .observablehq-style")();
      if (name === "draw")
        return Inspector.into("#observablehq-3176bb0d .observablehq-draw")();
      if (name === "indexSetter")
        return Inspector.into(
          "#observablehq-3176bb0d .observablehq-indexSetter"
        )();
    });
  }

  componentWillUnmount() {
    this.runtime?.dispose();
  }

  render() {
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
            />
            <Flex
              rounded={8}
              borderWidth="1px"
              pl={4}
              m={2}
              minH={10}
              className="observablehq-viewof-scale"
              align="center"
            />
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
            />
          </Container>

          <div className="observablehq-map"></div>
          <div className="observablehq-style" style={{ display: "none" }}></div>
          <div className="observablehq-draw" style={{ display: "none" }}></div>
          <div
            className="observablehq-indexSetter"
            style={{ display: "none" }}
          ></div>
        </div>
      </div>
    );
  }
}
