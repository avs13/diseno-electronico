import { LocationHistory } from "../types/LocationHistory";
import { splitRangeLocationByDateAndSpeed } from "./splitRangeLocationByDateAndSpeed";
import { Location } from "../types";
import dayjs from "dayjs";

export function buildRoutes(
  location: Location[],
  time: number = 1,
  maxSpeed = 84
): LocationHistory {
  const locationHistory: LocationHistory = {
    startDate: new Date(location[0].timestamp),
    endDate: new Date(location[location.length - 1].timestamp),
    routes: [],
  };

  const routes = splitRangeLocationByDateAndSpeed(location, time, maxSpeed);

  locationHistory.routes = routes.map((route, index) => {
    return {
      routeName: `Route ${index}`,
      startDate: new Date(route[0].timestamp),
      endDate: new Date(route[route.length - 1].timestamp),
      locations: route.map((location) => [
        location.latitude,
        location.longitude,
      ]),
      time: dayjs(route[route.length - 1].timestamp).diff(
        dayjs(route[0].timestamp),
        "m"
      ),
    };
  });

  return locationHistory;
}
