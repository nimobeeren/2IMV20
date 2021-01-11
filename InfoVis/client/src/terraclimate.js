export class Terraclimate {
  constructor() {
    this.raw = {}
    this.parsed = {}
    this.promises = {}
  }

  fetch(from, to) {
    for (let year = from; year <= to; year++) {
      if (!this.raw[year] && !this.promises[year]) {
        this.promises[year] = (async () => {
          const response = await fetch(`data/terraclimate/${year}.json`)
          this.raw[year] = await response.json()
          this.parsed[year] = this._convert(this.raw[year])
          console.info(`Fetched data from ${year}`)
        })()
      }
    }
  }

  _convert(data) {
    return data.map(d => {
      const parsed = []

      for (let i = 0, lat = 90; i <= d.length; i++, lat--) {
        const temps = d[i]

        if (!temps) {
          continue
        }

        for (let i = 0; i <= temps.length; i++) {
          const lon = i - 30
          if (temps[i]) {
            parsed.push({
              lon, lat,
              t: temps[i]
            })
          }
        }
      }

      return parsed
    })
  }

  async get(year) {
    if (this.parsed[year]) {
      return this.parsed[year]
    }

    if (this.promises[year]) {
      await this.promises[year]
      return this.parsed[year]
    }

    this.fetch(year, year)
    await this.promises[year]
    return this.parsed[year]
  }
}