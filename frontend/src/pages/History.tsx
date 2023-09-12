import { Map as LeafletMap } from "leaflet";
import { useRef, useState } from "react";
import loading from "./../assets/loading.gif";
import dayjs from "dayjs";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Polyline,
} from "react-leaflet";

import { LocationHistory, fetchGetLocations } from "./../service";
import { buildRoutes } from "./../utils";
import { iconEnd, iconStart, MagnifyinGlass } from "../components/icons";

export const History = () => {
  const mapRef = useRef<LeafletMap>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistory>({
    startDate: new Date(),
    endDate: new Date(),
    routes: [],
  });
  const [searching, setSearching] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:01");
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [endTime, setEndTime] = useState<string>("23:59");

  const onSearchHistory = async () => {
    if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
      setSearching(true);
      const data = await fetchGetLocations({
        dateI: startDate + "" + startTime,
        dateF: endDate + " " + endTime,
      });
      if (data.length > 0) {
        setLocationHistory(buildRoutes([...data]));
      } else {
        setLocationHistory({
          ...locationHistory,
          routes: [],
        });
      }
      setSearching(false);
    }
  };

  return (
    <div className="w-full h-full text-slate-800  flex flex-col gap-3">
      <div className=" border-solid border border-slate-300 rounded-lg p-2">
        <p className="font-semibold text-xl text-center">Mi ultima ubicacion</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex justify-between w-4/12">
            <div>
              <div>
                <span className="font-semibold">Fecha inicio: </span>
                <input
                  type="date"
                  max={endDate}
                  value={startDate}
                  onChange={({ target }) => {
                    setStartDate(target.value);
                  }}
                />
              </div>
              <div>
                <span className="font-semibold">Fecha final: </span>
                <input
                  type="date"
                  value={dayjs(endDate).format("YYYY-MM-DD")}
                  min={startDate ?? ""}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={({ target }) => {
                    setEndDate(target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <div>
                <span className="font-semibold">Hora inicio:</span>
                <input
                  type="time"
                  value={startTime}
                  max={endTime}
                  onChange={({ target }) => {
                    setStartTime(target.value);
                  }}
                />
              </div>

              <div>
                <span className="font-semibold">Hora final:</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={({ target }) => {
                    setEndTime(target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 active:bg-gray-700 transition p-1 rounded-md text-white flex px-2 py-1 items-center"
            onClick={onSearchHistory}
          >
            <MagnifyinGlass />
            Buscar
          </button>
        </form>
      </div>

      <div className="h-full flex gap-2">
        <div className="w-[220px] text-sm">
          <p className="font-semibold ">Recorridos disponibles</p>
          {searching && (
            <div className="flex justify-center mt-2">
              <img src={loading} width="40" />
            </div>
          )}
          {locationHistory.routes.length == 0 &&
            searching == false &&
            "No hay recorridos disponibles"}
          {searching == false &&
            locationHistory.routes.length > 0 &&
            locationHistory.routes.map((route) => (
              <div
                className="mb-2 pl-1 border hover:bg-slate-100 cursor-pointer "
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.setView([
                      route.locations[route.locations.length - 1][0],
                      route.locations[route.locations.length - 1][1],
                    ]);
                    mapRef.current.setZoom(14);
                  }
                }}
              >
                <p>
                  <span className="italic font-semibold">Fecha: </span>
                  {dayjs(route.startDate).format("DD/MM/YYYY MM:ss  a")}
                </p>
                <p>
                  <span className="italic font-semibold">Inicio</span>
                  {` ${route.locations[0][0].toFixed(
                    4
                  )} , ${route.locations[0][1].toFixed(4)}`}
                </p>
                <p>
                  <span className="italic font-semibold">Final:</span>
                  {` ${route.locations[route.locations.length - 1][0].toFixed(
                    4
                  )} , ${route.locations[route.locations.length - 1][1].toFixed(
                    4
                  )}`}
                </p>
                <p>
                  <span className="italic font-semibold">Tiempo: </span>
                  {route.time + " min"}
                </p>
              </div>
            ))}
        </div>
        <MapContainer
          className="w-full h-full"
          ref={mapRef}
          center={[10.9731648, -74.8069377]}
          zoom={12}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locationHistory.routes.map((route) => (
            <>
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
            </>
          ))}

          {locationHistory.routes.map((route) => (
            <Polyline
              key={route.routeName}
              positions={route.locations}
              color="red"
              lineCap="butt"
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
