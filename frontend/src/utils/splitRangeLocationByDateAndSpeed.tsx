import { Location } from "../types";
import dayjs from "dayjs";
import { calculateDistance } from "./calculateDistance";

export function splitRangeLocationByDateAndSpeed(
  locations: Location[],
  time: number = 1,
  maxSpeed = 84
): Location[][] {
  const routes: Array<Location[]> = [];
  let route: Location[] = [];
  let beforeLocation = locations[0];

  locations.splice(1).map((location) => {
    const before = dayjs(beforeLocation.timestamp);
    const current = dayjs(location.timestamp);

    if (current.diff(before, "m") > time) {
      routes.push(route);
      route = [location];
    } else if (
      calculateDistance(beforeLocation, location) /
        Math.abs(current.diff(before, "s")) >
      maxSpeed
    ) {
      routes.push(route);
      route = [location];
    } else {
      route.push(location);
    }
    beforeLocation = location;
  });

  routes.push(route);
  return routes;
}
