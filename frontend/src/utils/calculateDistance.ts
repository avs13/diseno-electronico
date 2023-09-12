import { Location } from "../types";

export function calculateDistance(before: Location, current: Location) {
  const EARTH_RADIO = 6371;

  const beforeTouple = [
    (before.latitude * Math.PI) / 180,
    (before.longitude * Math.PI) / 180,
  ];
  const currentTouple = [
    (current.latitude * Math.PI) / 180,
    (current.longitude * Math.PI) / 180,
  ];

  const dLatitud = currentTouple[0] - beforeTouple[0];
  const dLongitud = currentTouple[1] - beforeTouple[1];

  const a =
    Math.sin(dLatitud / 2) ** 2 +
    Math.cos(beforeTouple[0]) *
      Math.cos(currentTouple[0]) *
      Math.sin(dLongitud / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIO * c;

  return distance * 1000;
}
