import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "../../from_observablehq/contour_parana";

class ContourParana extends Component {
  componentDidMount() {
    new Runtime().module(notebook, (name: string) => {
      if (name === "map")
        return Inspector.into(
          "#observablehq-contour-state .observablehq-map"
        )();
    });
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
