import { Location } from "../types";

export const fetchGetLocations = async (query: {
  dateI: string;
  dateF: string;
}) => {
  const reponse = await fetch(
    "/api/location/?" + new URLSearchParams(query)
  );
  const data = await (reponse.json() as Promise<Location[]>);
  return data;
};
