import end from "../../assets/start2.svg";
import start from "../../assets/car.svg";

import { Icon, Point } from "leaflet";
export const iconStart = new Icon({
  iconUrl: start,
  iconRetinaUrl: start,
  popupAnchor: [-0, -0],
  className: "fill-slate-900",
  iconSize: new Point(40, 40),
});

export const iconEnd = new Icon({
  iconUrl: end,
  iconRetinaUrl: end,
  popupAnchor: [-0, -0],
  className: "fill-slate-900",
  iconSize: new Point(40, 40),
});
