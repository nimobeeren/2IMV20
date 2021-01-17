import L from "leaflet";

export const LATITUDE_RANGE = [-45, 75];
export const LONGITUDE_RANGE = [-29, 60];

export const BOUNDS = L.latLngBounds(
  L.latLng(LATITUDE_RANGE[0], LONGITUDE_RANGE[0]),
  L.latLng(LATITUDE_RANGE[1], LONGITUDE_RANGE[1])
);

export const MIN_YEAR = 1953;
export const MAX_YEAR = 2019;
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function numToMonth(num) {
  if (num <= 0 || num > 12) {
    throw new Error("month number must be between 1 and 12");
  }
  return MONTHS[num - 1];
}

export function monthToNum(month) {
  const i = MONTHS.indexOf(month);
  if (i == -1) {
    throw new Error("invalid month");
  }
  return i + 1;
}
