import { useEffect, useRef } from "react";
import { renderContourMap } from "./contourMap";

export default function ContourBrazil() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (mapRef.current) {
      renderContourMap(mapRef.current, "brazil").then(() => {
        if (!isMounted) mapRef.current?.replaceChildren();
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div id="observablehq-c65430d5">
      <div ref={mapRef} className="observablehq-map" />
      <div className="observablehq-style" style={{ display: "none" }} />
    </div>
  );
}
