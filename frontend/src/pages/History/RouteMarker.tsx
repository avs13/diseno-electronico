import { Marker, Polyline, Popup } from "react-leaflet";
import dayjs from "dayjs";

import { iconEnd, iconStart } from "../../components/icons";
import { Route } from "../../types";

export const RouteMarker = ({ route }: { route: Route }) => {
  return (
    <>
      <Marker position={route.locations[0]} icon={iconStart}>
        <Popup>{`Primera ubicacion: ${dayjs(route.startDate).format(
          "DD/MM/YYYY mm:s a"
        )}`}</Popup>
      </Marker>
      <Marker
        position={route.locations[route.locations.length - 1]}
        icon={iconEnd}
      >
        <Popup>{`Ultima ubicacion: 
        ${dayjs(route.endDate).format("DD/MM/YYYY mm:s a")}`}</Popup>
      </Marker>
      <Polyline
        key={route.routeName}
        positions={route.locations}
        color="red"
        lineCap="butt"
      />
    </>
  );
};
