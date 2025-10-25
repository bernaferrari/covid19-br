import React, { Component } from "react";
import type { Runtime } from "@observablehq/runtime";
import { Inspector } from "@observablehq/inspector";
import notebook from "../../from_observablehq/contour_brazil";
import { createRuntime } from "../../utils/observableRuntime";

class ContourBrazil extends Component {
  private runtime?: Runtime;

  componentDidMount() {
    this.runtime = createRuntime();
    this.runtime.module(notebook, (name: string) => {
      if (name === "map")
        return Inspector.into("#observablehq-c65430d5 .observablehq-map")();
      if (name === "style")
        return Inspector.into("#observablehq-c65430d5 .observablehq-style")();
    });
  }

  componentWillUnmount() {
    this.runtime?.dispose();
  }

  render() {
    return (
      <div id="observablehq-c65430d5">
        <div className="observablehq-map" />
        <div className="observablehq-style" style={{ display: "none" }}></div>
      </div>
    );
  }
}

export default ContourBrazil;
