export function acurrancyMetersToDegrees(acurracyMeters: number) {
  const EARTH_PERIMETER = 40075000;
  return (360 * acurracyMeters) / EARTH_PERIMETER;
}
