import { Location } from "../types/location";
export function isValidCoordinates(coordinates: Location): boolean {
  const { longitude, latitude } = coordinates;
  return latitude > -90 && latitude < 90 && longitude > -180 && longitude < 180;
}
