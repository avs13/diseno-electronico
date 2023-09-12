import { LatLngTuple } from "leaflet";

export interface LocationHistory {
  startDate: Date;
  endDate: Date;
  routes: Route[];
}

export interface Route {
  routeName: string;
  startDate: Date;
  endDate: Date;
  time: number;
  locations: LatLngTuple[];
}
