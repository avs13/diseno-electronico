import { Location } from "../types";

export const fetchGetLocations = async (query: {
  dateI: string;
  dateF: string;
}) => {
  const reponse = await fetch(
    "http://localhost:8000/api/location/?" + new URLSearchParams(query)
  );
  const data = await (reponse.json() as Promise<Location[]>);
  return data;
};
