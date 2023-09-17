import { Location } from "../types";

export const fetchGetLocations = async (query: {
  dateI: string;
  dateF: string;
  longitude?: number;
  latitude?: number;
  acurracyDegree?: number;
}) => {
  const reponse = await fetch(
    "/api/location/?" +
      new URLSearchParams({
        ...query,
        acurracyDegree: query.acurracyDegree?.toString() || "",
        longitude: query.longitude?.toString() || "",
        latitude: query.latitude?.toString() || "",
      })
  );
  const data = await (reponse.json() as Promise<Location[]>);
  return data;
};
