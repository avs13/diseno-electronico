import { useCallback, useMemo, useRef, useState } from "react";
import { Marker, Popup, Rectangle, useMapEvents } from "react-leaflet";

interface Props {
  range: number;
  position: { lat: number; lng: number };
  setPosition: ({}: { lat: number; lng: number }) => void;
}

export const SelectAreaMarker = ({ range, position, setPosition }: Props) => {
  const [hidden, setHidden] = useState(true);
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
      setHidden(false);
      setPosition(e.latlng);
    },
  });
  const toggleDraggable = useCallback(() => {
    setHidden(true);
  }, []);
  if (!hidden)
    return (
      <>
        (
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
        >
          <Popup minWidth={90}>
            <span onClick={toggleDraggable}>Eliminar Marker</span>
          </Popup>
        </Marker>
        )
        <Rectangle
          bounds={[
            [position.lat - range, position.lng - range],
            [position.lat + range, position.lng + range],
          ]}
          pathOptions={{ color: "yellow" }}
        />
      </>
    );
  else {
    <></>;
  }
};
