import { useEffect } from "react";
import { LatLngLiteral, Map as LeafletMap } from "leaflet";
import { useRef, useState } from "react";
import { SelectAreaMarker } from "./SelectAreaMarker";
import loading from "./../../assets/loading.gif";
import { RoutesMarker } from "./RoutesMarker";
import { Search } from "./Search";
import dayjs from "dayjs";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Location, LocationHistory } from "./../../types";
import { fetchGetLocations } from "./../../service";
import { buildRoutes } from "./../../utils";
import { RouteMarker } from "./RouteMarker";
import { RouteCard } from "./RouteCard";

export const History = () => {
  const mapRef = useRef<LeafletMap>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationHistory, setLocationHistory] = useState<LocationHistory>({
    startDate: new Date(),
    endDate: new Date(),
    routes: [],
  });
  const [rangeDate, setRangeDate] = useState({
    startDate: dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"),
    endDate: dayjs().endOf("day").format("YYYY-MM-DDTHH:mm"),
  });
  const [position, setPosition] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
  const [area, setArea] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
  const [searching, setSearching] = useState(false);
  const [searchByArea, setSearchByArea] = useState(false);
  const [selection, setSelection] = useState(0);

  const onSearchHistory = async () => {
    if (
      dayjs(rangeDate.startDate).isValid() &&
      dayjs(rangeDate.endDate).isValid()
    ) {
      setSearching(true);
      let query = {
        dateI: rangeDate.startDate,
        dateF: rangeDate.endDate,
      };
      if (searchByArea) {
        query = {
          dateI: rangeDate.startDate,
          dateF: rangeDate.endDate,
          //@ts-ignore
          acurracyDegreeLat: area.lat,
          acurracyDegreeLng: area.lng,
          longitude: position.lng,
          latitude: position.lat,
        };
      }
      const data = await fetchGetLocations(query);
      if (data.length > 0) {
        setLocations(data);
        const locationHistory = buildRoutes([...data]);
        setLocationHistory(locationHistory);
        setSelection(data.length);
      } else {
        setLocations([]);
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
    onSearchHistory();
  }, [position, area, rangeDate]);

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
          rangeDate={rangeDate}
          setRangeDate={setRangeDate}
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
          {/*  {!searching &&
            searchByArea &&
            locationHistory.routes.length > 0 &&
            selection > 0 && (
              <RouteCard
                route={locationHistory.routes[selection - 1]}
                index={selection}
              />
            )} */}

          {!searchByArea && (
            <>
              {!searching &&
                locationHistory.routes.length > 0 &&
                locationHistory.routes.map((route, index) => (
                  <RouteCard
                    route={route}
                    key={index}
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setView([
                          route.locations[route.locations.length - 1][0],
                          route.locations[route.locations.length - 1][1],
                        ]);
                        mapRef.current.setZoom(14);
                      }
                    }}
                  />
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

          {searchByArea && locations.length > 0 && selection > 0 && (
            <>
              <Marker
                position={{
                  lat: locations[selection - 1].latitude,
                  lng: locations[selection - 1].longitude,
                }}
              ></Marker>
              <Popup
                position={{
                  lat: locations[selection - 1].latitude,
                  lng: locations[selection - 1].longitude,
                }}
              >
                {`Estuvo a las: ${dayjs(
                  locations[selection - 1].timestamp
                ).format("DD/MM/YYYY hh:mm a")}`}
              </Popup>
            </>
          )}

          <SelectAreaMarker
            range={area}
            setRange={setArea}
            position={position}
            setPosition={setPosition}
            searchByArea={searchByArea}
            setSearchByArea={setSearchByArea}
          />
        </MapContainer>
      </div>
      {searchByArea && (
        <div className="w-1/2 mx-auto flex">
          <input
            type="range"
            min="0"
            value={selection}
            onChange={({ target }) => setSelection(parseInt(target.value))}
            max={locations.length}
            className="w-full"
            disabled={locations.length == 0}
          />
          <p>{selection + "/" + locations.length}</p>
        </div>
      )}
    </div>
  );
};
