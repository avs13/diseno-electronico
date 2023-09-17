import { useEffect } from "react";
import { Map as LeafletMap } from "leaflet";
import { useRef, useState } from "react";
import { SelectAreaMarker } from "./SelectAreaMarker";
import loading from "./../../assets/loading.gif";
import { RoutesMarker } from "./RoutesMarker";
import { Search } from "./Search";
import dayjs from "dayjs";
import { MapContainer, TileLayer } from "react-leaflet";
import { LocationHistory } from "./../../types";
import { fetchGetLocations } from "./../../service";
import { acurrancyMetersToDegrees, buildRoutes } from "./../../utils";
import { RouteMarker } from "./RouteMarker";

export const History = () => {
  const mapRef = useRef<LeafletMap>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistory>({
    startDate: new Date(),
    endDate: new Date(),
    routes: [],
  });
  const [rangeDate, setRangeDate] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    startTime: "00:01",
    endDate: dayjs().format("YYYY-MM-DD"),
    endTime: "23:59",
  });
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [searching, setSearching] = useState(false);
  const [searchByArea, setSearchByArea] = useState(false);
  const [area, setArea] = useState(100);
  const [selection, setSelection] = useState(0);

  const onSearchHistory = async () => {
    if (
      dayjs(rangeDate.startDate).isValid() &&
      dayjs(rangeDate.endDate).isValid()
    ) {
      setSearching(true);
      let query = {
        dateI: rangeDate.startDate + "" + rangeDate.startTime,
        dateF: rangeDate.endDate + " " + rangeDate.endTime,
      };
      if (searchByArea) {
        query = {
          dateI: rangeDate.startDate + "" + rangeDate.startTime,
          dateF: rangeDate.endDate + " " + rangeDate.endTime,
          //@ts-ignore
          acurracyDegree: acurrancyMetersToDegrees(area),
          longitude: position.lng,
          latitude: position.lat,
        };
      }
      const data = await fetchGetLocations(query);
      if (data.length > 0) {
        const locationHistory = buildRoutes([...data]);
        setLocationHistory(locationHistory);
        setSelection(locationHistory.routes.length);
      } else {
        setLocationHistory({
          ...locationHistory,
          routes: [],
        });
        setSelection(0);
      }
      setSearching(false);
    }
  };

  useEffect(() => {
    setLocationHistory({
      startDate: new Date(),
      endDate: new Date(),
      routes: [],
    });
  }, [searchByArea]);

  return (
    <div className="w-full h-full text-slate-800  flex flex-col gap-3">
      <div className=" border-solid border border-slate-300 rounded-lg p-2">
        <Search
          area={area}
          rangeDate={rangeDate}
          setRangeDate={setRangeDate}
          searchByArea={searchByArea}
          setSearchByArea={setSearchByArea}
          setArea={setArea}
          onSearchHistory={onSearchHistory}
        />
      </div>

      <div className="h-full flex gap-2">
        <div className="w-[220px] text-sm max-h-[650px] overflow-auto ">
          <p className="font-semibold ">Recorridos disponibles</p>
          {searching && (
            <div className="flex justify-center mt-2">
              <img src={loading} width="40" />
            </div>
          )}
          {!locationHistory.routes.length &&
            !searching &&
            "No hay recorridos disponibles"}
          {searchByArea && locationHistory.routes.length > 0 && (
            <p>{`Recorridos Disponibles ${locationHistory.routes.length}`}</p>
          )}
          {!searchByArea && (
            <>
              {!searching &&
                locationHistory.routes.length > 0 &&
                locationHistory.routes.map((route, index) => (
                  <div
                    key={index}
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
                      {` ${route.locations[
                        route.locations.length - 1
                      ][0].toFixed(4)} , ${route.locations[
                        route.locations.length - 1
                      ][1].toFixed(4)}`}
                    </p>
                    <p>
                      <span className="italic font-semibold">Tiempo: </span>
                      {route.time + " min"}
                    </p>
                  </div>
                ))}
            </>
          )}
        </div>

        <MapContainer
          className="w-full h-full"
          ref={mapRef}
          center={[10.9731648, -74.8069377]}
          zoom={12}
          scrollWheelZoom={false}
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!searchByArea && <RoutesMarker routes={locationHistory.routes} />}

          {searchByArea &&
            locationHistory.routes.length > 0 &&
            selection > 0 && (
              <RouteMarker route={locationHistory.routes[selection - 1]} />
            )}

          {searchByArea && (
            <SelectAreaMarker
              range={acurrancyMetersToDegrees(area)}
              position={position}
              setPosition={setPosition}
            />
          )}
        </MapContainer>
      </div>
      {searchByArea && (
        <div className="w-1/3 mx-auto flex">
          <input
            type="range"
            min="0"
            value={selection}
            onChange={({ target }) => setSelection(parseInt(target.value))}
            max={locationHistory.routes.length}
            className="w-full"
            disabled={locationHistory.routes.length == 0}
          />
          <p>{selection + "/" + locationHistory.routes.length}</p>
        </div>
      )}
    </div>
  );
};
