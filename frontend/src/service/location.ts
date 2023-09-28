import { Location } from "../types";

interface Query {
  dateI: string;
  dateF: string;
  longitude?: number;
  latitude?: number;
  acurracyDegreeLat?: number;
  acurracyDegreeLng?: number;
}

export const fetchGetLocations = async (query: Query) => {
  const reponse = await fetch(
    "/api/location/?" +
      new URLSearchParams({
        ...query,
        acurracyDegreeLng: query.acurracyDegreeLng?.toString() || "",
        acurracyDegreeLat: query.acurracyDegreeLat?.toString() || "",
        longitude: query.longitude?.toString() || "",
        latitude: query.latitude?.toString() || "",
      })
  );
  const data = await (reponse.json() as Promise<Location[]>);
  return data;
};
