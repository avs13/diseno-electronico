import dayjs from "dayjs";
import { Route } from "./../../types";

interface Props {
  route: Route;
  index?: number;
  onClick?: () => void;
}

export const RouteCard = ({ route, onClick, index }: Props) => {
  return (
    <div
      className="mb-2 pl-1 border hover:bg-slate-100 cursor-pointer "
      onClick={onClick}
    >
      {index && (
        <p>
          <span className="italic font-semibold">Recorrido: </span>
          {index}
        </p>
      )}
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
        )} , ${route.locations[route.locations.length - 1][1].toFixed(4)}`}
      </p>
      <p>
        <span className="italic font-semibold">Tiempo: </span>
        {route.time + " min"}
      </p>
    </div>
  );
};
