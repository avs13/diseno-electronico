import { useCallback, useMemo, useRef } from "react";
import { Marker, Popup, Rectangle, useMapEvents } from "react-leaflet";
import { LatLngLiteral } from "leaflet";
interface Props {
  range: LatLngLiteral;
  position: LatLngLiteral;
  searchByArea: boolean;
  setPosition: ({}: LatLngLiteral) => void;
  setRange: ({}: LatLngLiteral) => void;
  setSearchByArea: (hidden: boolean) => void;
}

export const SelectAreaMarker = ({
  range,
  position,
  setPosition,
  setRange,
  searchByArea,
  setSearchByArea,
}: Props) => {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          //@ts-ignore
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  useMapEvents({
    dblclick: (e) => {
      setPosition(e.latlng);
    },
    //@ts-ignore
    boxzoomend: (e) => {
      const y = e.boxZoomBounds;
      const first = y._northEast;

      const second = y._southWest;
      setSearchByArea(true);
      setPosition({
        lat: (first.lat + second.lat) / 2,
        lng: (first.lng + second.lng) / 2,
      });
      setRange({
        lat: (first.lat - second.lat) / 2,
        lng: (first.lng - second.lng) / 2,
      });
    },
  });

  const toggleDraggable = useCallback(() => {
    setSearchByArea(false);
  }, []);
  if (searchByArea)
    return (
      <>
        (
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
        >
          <Popup minWidth={90} className="cursor-pointer">
            <span onClick={toggleDraggable}>Dejar de buscar por area</span>
          </Popup>
        </Marker>
        )
        <Rectangle
          bounds={[
            [position.lat - range.lat, position.lng - range.lng],
            [position.lat + range.lat, position.lng + range.lng],
          ]}
          pathOptions={{ color: "yellow" }}
        />
      </>
    );
  else {
    <></>;
  }
};
