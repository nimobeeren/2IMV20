import { scaleLinear } from "d3-scale";

export const SCALE_DOMAIN = [-4, -2, 0, 2, 4];
export const SCALE_COLORS = [
  "#2980b9",
  "#3498db",
  "#ecf0f1",
  "#f1c40f",
  "#c0392b",
];

export const SCALE_FUNCTION = scaleLinear()
  .domain(SCALE_DOMAIN)
  .range(SCALE_COLORS);

export class Gistemp {
  constructor() {
    this.data = {};
  }

  async fetch(from, to) {
    for (let year = from; year <= to; year++) {
      if (!this.data[year]) {
        const response = await fetch(`data/gistemp/${year}.json`);
        const raw = await response.json();
        this.data[year] = this._convert(raw);
        console.info(`Fetched temperature data from ${year}`);
      }
    }
  }

  _convert(data) {
    return data.map((d) => {
      const parsed = {};

      for (let i = 0, lat = -89; i <= d.length; i++, lat += 2) {
        const temps = d[i];
        parsed[lat] = {};

        if (!temps) {
          continue;
        }

        for (let i = 0, lon = -179; i <= temps.length; i++, lon += 2) {
          if (temps[i]) {
            parsed[lat][lon] = {
              t: temps[i],
              c: SCALE_FUNCTION(temps[i]),
            };
          }
        }
      }

      return parsed;
    });
  }

  get(year) {
    return this.data[year];
  }
}
