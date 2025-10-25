import React, { Component } from "react";
import type { Runtime } from "@observablehq/runtime";
import { Inspector } from "@observablehq/inspector";
import notebook from "../../from_observablehq/contour_parana";
import { createRuntime } from "../../utils/observableRuntime";

class ContourParana extends Component {
  private runtime?: Runtime;

  componentDidMount() {
    this.runtime = createRuntime();
    this.runtime.module(notebook, (name: string) => {
      if (name === "map")
        return Inspector.into(
          "#observablehq-contour-state .observablehq-map"
        )();
    });
  }

  componentWillUnmount() {
    this.runtime?.dispose();
  }

  render() {
    return (
      <div id="observablehq-contour-state">
        <div className="observablehq-map" />
      </div>
    );
  }
}

export default ContourParana;
