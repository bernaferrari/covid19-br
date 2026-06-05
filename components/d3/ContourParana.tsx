import { useEffect, useRef } from "react";
import { renderContourMap } from "./contourMap";

export default function ContourParana() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (mapRef.current) {
      renderContourMap(mapRef.current, "parana").then(() => {
        if (!isMounted) mapRef.current?.replaceChildren();
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} />
    </div>
  );
}
