import React, { Component } from "react";
import type { Runtime } from "@observablehq/runtime";
import { Inspector } from "@observablehq/inspector";
import { Box, Flex } from "@chakra-ui/react";
import notebook from "../../from_observablehq/daily_lines";
import styled from "@emotion/styled";
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
      if (name === "viewof indicator")
        return Inspector.into(
          "#observablehq-65e7d81f .observablehq-viewof-indicator"
        )();
      if (name === "chart")
        return Inspector.into("#observablehq-65e7d81f .observablehq-chart")();
    });
  }

  componentWillUnmount() {
    this.runtime?.dispose();
  }

  render() {
    return (
      <div className="Map">
        <div id="observablehq-65e7d81f">
          <Container>
            <Flex
              rounded={8}
              borderWidth="1px"
              pl={4}
              m={2}
              minH={10}
              className="observablehq-viewof-indicator"
              align="center"
              alignContent="center"
            />
          </Container>

          <Box
            h={400}
            id="externalDivForDaily"
            className="observablehq-chart"
          />
        </div>
      </div>
    );
  }
}
