import { fetchGetLocations } from "./../service";
import { useRef, useState } from "react";
import { LatLngTuple, Map as LeafletMap } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Polyline,
} from "react-leaflet";
import dayjs from "dayjs";

export const History = () => {
  const mapRef = useRef<LeafletMap>(null);
  const [poly, setPoly] = useState<LatLngTuple[]>([]);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:01");
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [endTime, setEndTime] = useState<string>("23:59");
  const [marker, setMarker] = useState<LatLngTuple>([0, 0]);

  const onSearchHistory = async () => {
    if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
      const data = await fetchGetLocations({
        dateI: startDate + "" + startTime,
        dateF: endDate + " " + endTime,
      });
      if (data.length > 0) {
        const locationTuples: LatLngTuple[] = data.map((location) => [
          location.latitude,
          location.longitude,
        ]);
        setPoly(locationTuples);
        setMarker(locationTuples[locationTuples.length - 1]);
      }
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            Buscar
          </button>
        </form>
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
        <Marker position={marker}>
          <Popup>{`ultima ubicacion: ${marker[0].toFixed(
            5
          )} , ${marker[1].toFixed(5)}`}</Popup>
        </Marker>
        {poly.length >= 2 && (
          <Polyline positions={poly} color="red" lineCap="butt" />
        )}
      </MapContainer>
    </div>
  );
};
