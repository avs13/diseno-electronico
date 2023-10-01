import "leaflet-arrowheads";
import { ArrowheadOptions } from "leaflet-arrowheads";
import { useEffect, useRef } from "react";
import { Polyline, PolylineProps } from "react-leaflet";

type LeafletPolyline = typeof Polyline;

interface CustomPolylineRef extends LeafletPolyline {
  arrowheads(options: ArrowheadOptions): void;
  _update(): void;
}

interface Props extends PolylineProps {
  arrowheads?: ArrowheadOptions;
}

export const ArrowheadsPolyline = (props: Props) => {
  const polylineRef = useRef<CustomPolylineRef>(null);

  useEffect(() => {
    const polyline = polylineRef.current;
    if (props.arrowheads && polyline !== null && polyline !== undefined) {
      polyline.arrowheads(props.arrowheads);
      polyline._update();
    }
  }, [props.arrowheads]);

  return (
    <Polyline
      {...props}
      //@ts-ignore
      ref={polylineRef}
    />
  );
};
