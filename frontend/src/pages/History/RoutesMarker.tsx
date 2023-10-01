import { Marker, Popup } from "react-leaflet";
import { Fragment } from "react";

import { iconEnd, iconStart } from "../../components/icons";
import { Route } from "../../types";
import { ArrowheadsPolyline } from "./../../components";
interface Props {
  routes: Route[];
}

export const RoutesMarker = ({ routes }: Props) => {
  return (
    <>
      {routes.map((route, index) => (
        <Fragment key={index}>
          <Marker position={route.locations[0]} icon={iconStart}>
            <Popup>{`${
              route.routeName
            } Primera ubicacion: ${route.locations[0][0].toFixed(
              5
            )} , ${route.locations[0][1].toFixed(5)}`}</Popup>
          </Marker>

          <Marker
            position={route.locations[route.locations.length - 1]}
            icon={iconEnd}
          >
            <Popup>{`${route.routeName} Ultima ubicacion: ${route.locations[
              route.locations.length - 1
            ][0].toFixed(5)} , ${route.locations[
              route.locations.length - 1
            ][1].toFixed(5)}`}</Popup>
          </Marker>

          <ArrowheadsPolyline
            positions={route.locations}
            color="red"
            arrowheads={{
              size: "10px",
              frequency: "50px",
              fill: true,
            }}
          />
        </Fragment>
      ))}
    </>
  );
};
