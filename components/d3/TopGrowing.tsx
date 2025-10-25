import React, { Component } from "react";
import type { Runtime } from "@observablehq/runtime";
import { Inspector } from "@observablehq/inspector";
import notebook from "../../from_observablehq/top_growing";
import { createRuntime } from "../../utils/observableRuntime";

class TopGrowing extends Component {
  private runtime?: Runtime;

  componentDidMount() {
    this.runtime = createRuntime();
    this.runtime.module(notebook, (name: string) => {
      if (name === "table")
        return Inspector.into("#observablehq-b9b69f31 .observablehq-table")();
      if (name === "confirmedMovingAvg")
        return Inspector.into(
          "#observablehq-b9b69f31 .observablehq-confirmedMovingAvg"
        )();
    });
  }

  componentWillUnmount() {
    this.runtime?.dispose();
  }

  render() {
    return (
      <div className="TopGrowing">
        <div id="observablehq-b9b69f31">
          <div className="observablehq-table"></div>
          <div
            className="observablehq-confirmedMovingAvg"
            style={{ display: "none" }}
          ></div>
        </div>
      </div>
    );
  }
}

export default TopGrowing;
