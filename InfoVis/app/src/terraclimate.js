import { scaleLinear } from "d3-scale";

export const SCALE_DOMAIN = [-15, 0, 15, 30];
export const SCALE_COLORS = ["#2980b9", "#ecf0f1", "#f1c40f", "#c0392b"];

export const SCALE_FUNCTION = scaleLinear()
  .domain(SCALE_DOMAIN)
  .range(SCALE_COLORS);

export class Terraclimate {
  constructor() {
    this.raw = {};
    this.parsed = {};
    this.promises = {};
  }

  fetch(from, to) {
    for (let year = from; year <= to; year++) {
      if (!this.raw[year] && !this.promises[year]) {
        this.promises[year] = (async () => {
          const response = await fetch(`data/terraclimate/${year}.json`);
          this.raw[year] = await response.json();
          this.parsed[year] = this._convert(this.raw[year]);
          console.info(`Fetched data from ${year}`);
        })();
      }
    }
  }

  _convert(data) {
    return data.map((d) => {
      const parsed = {};

      for (let i = 0, lat = 90; i <= d.length; i++, lat--) {
        const temps = d[i];
        parsed[lat] = {};

        if (!temps) {
          continue;
        }

        for (let i = 0; i <= temps.length; i++) {
          const lon = i - 30;
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

  async get(year) {
    if (this.parsed[year]) {
      return this.parsed[year];
    }

    if (this.promises[year]) {
      await this.promises[year];
      return this.parsed[year];
    }

    this.fetch(year, year);
    await this.promises[year];
    return this.parsed[year];
  }
}
