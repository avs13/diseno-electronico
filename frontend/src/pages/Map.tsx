import { isValidCoordinates } from "./../utils/isValidCoordinates";
import { useEffect, useRef, useState } from "react";
import { Location } from "./../types/location";
import { LatLngTuple, Map as LeafletMap } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Polyline,
} from "react-leaflet";
import dayjs from "dayjs";

const socket = new WebSocket(`ws://${location.host}`);

export const Map = () => {
  const mapRef = useRef<LeafletMap>(null);
  const [poly, setPoly] = useState<LatLngTuple[]>([]);
  const [trace, setTrace] = useState(true);
  const [position, setPosition] = useState<LatLngTuple>([0, 0]);
  const [location, setLocation] = useState<Location>({
    longitude: 10.9731648,
    latitude: -74.8069377,
    timestamp: 0,
  });

  useEffect(() => {
    socket.addEventListener("message", (event) => {
      actualizarDatos(JSON.parse(event.data));
    });
  }, []);

  const actualizarDatos = (datos: Location) => {
    if (isValidCoordinates(datos)) {
      setLocation(datos);
      setPoly((poly) => [...poly, [datos.latitude, datos.longitude]]);
      setPosition([datos.latitude, datos.longitude]);
      if (mapRef.current) {
        mapRef.current.setView([datos.latitude, datos.longitude]);
        if (mapRef.current.getZoom() == 12) mapRef.current.setZoom(20);
      }
    }
  };

  return (
    <div className="w-full h-full text-slate-800  flex flex-col gap-3">
      <div className=" border-solid border border-slate-300 rounded-lg p-2">
        <p className="font-semibold text-xl text-center">MY GPS</p>
        <div className="flex justify-between w-4/12">
          <div>
            <p>
              <span className="font-semibold">Latitud:</span>
              {location.latitude}
            </p>
            <p>
              <span className="font-semibold">Longitud:</span>
              {location.longitude}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Fecha:</span>
              {dayjs(location.timestamp).format("DD/MM/YYYY")}
            </p>

            <p>
              <span className="font-semibold">Hora:</span>
              {dayjs(location.timestamp).format("hh:mm:ss a")}
            </p>
          </div>
        </div>
      </div>
      <button onClick={() => setTrace((trace) => !trace)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          viewBox="0 -960 960 960"
          width="30"
          className="bg-gray-800 hover:bg-gray-900 active:bg-gray-700 transition p-1 rounded-md fill-slate-100"
        >
          <path d="M360-120q-66 0-113-47t-47-113v-327q-35-13-57.5-43.5T120-720q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 69.5T280-607v327q0 33 23.5 56.5T360-200q33 0 56.5-23.5T440-280v-400q0-66 47-113t113-47q66 0 113 47t47 113v327q35 13 57.5 43.5T840-240q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-39 22.5-70t57.5-43v-327q0-33-23.5-56.5T600-760q-33 0-56.5 23.5T520-680v400q0 66-47 113t-113 47ZM240-680q17 0 28.5-11.5T280-720q0-17-11.5-28.5T240-760q-17 0-28.5 11.5T200-720q0 17 11.5 28.5T240-680Zm480 480q17 0 28.5-11.5T760-240q0-17-11.5-28.5T720-280q-17 0-28.5 11.5T680-240q0 17 11.5 28.5T720-200ZM240-720Zm480 480Z" />
        </svg>
      </button>
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
        <Marker position={position}>
          <Popup>{`ubicacion: ${position[0].toFixed(5)} , ${position[1].toFixed(
            5
          )}`}</Popup>
        </Marker>
        {poly.length >= 2 && trace && <Polyline positions={poly} />}
      </MapContainer>
    </div>
  );
};
