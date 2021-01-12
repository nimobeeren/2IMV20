<script>
  import { LATITUDE_RANGE, LONGITUDE_RANGE } from "./utils";
  import L from "leaflet";
  import "leaflet.sync";
  import "leaflet/dist/leaflet.css";

  import { onMount } from "svelte";
  import {
    Terraclimate,
    SCALE_DOMAIN as TEMPERATURE_SCALE_DOMAIN,
    SCALE_COLORS as TEMPERATURE_SCALE_COLORS,
  } from "./terraclimate";
  import Scale from "./Scale.svelte";

  export let currentYear;
  export let startYear;
  export let endYear;
  export let month;

  const CENTER = [35.775972, 17.636095];

  const MAP_OPTIONS = {
    style: {
      color: "#ffffff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0,
    },
  };

  const temperature = {
    source: new Terraclimate(),
    map: null,
    grid: {},
  };

  const birds = {
    map: null,
    grid: {},
  };

  onMount(async () => {
    temperature.map = L.map("temperature-map", {
      attributionControl: false,
    }).setView(CENTER, 3);
    birds.map = L.map("birds-map", { zoomControl: false }).setView(CENTER, 3);

    temperature.map.sync(birds.map);
    birds.map.sync(temperature.map);

    const map = await (
      await fetch(
        "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/cultural/ne_110m_admin_0_countries.json"
      )
    ).json();

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat++) {
      temperature.grid[lat] = {};
      birds.grid[lat] = {};

      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon++) {
        const coord = [
          [lat - 1, lon],
          [lat, lon + 1],
        ];

        const opt = { color: "transparent", weight: 0, fillOpacity: 1 };

        temperature.grid[lat][lon] = L.rectangle(coord, opt).addTo(
          temperature.map
        );
        birds.grid[lat][lon] = L.rectangle(coord, opt).addTo(birds.map);
      }
    }

    L.geoJSON(map, MAP_OPTIONS).addTo(temperature.map);
    L.geoJSON(map, MAP_OPTIONS).addTo(birds.map);
  });

  async function renderTemperature() {
    if (!temperature.map) return;

    const yearData = await temperature.source.get(currentYear);
    const data = yearData[month - 1];

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat++) {
      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon++) {
        if (data[lat][lon]) {
          temperature.grid[lat][lon].setStyle({
            color: data[lat][lon].c,
          });
        } else {
          temperature.grid[lat][lon].setStyle({ color: "transparent" });
        }
      }
    }
  }

  $: {
    (async () => {
      console.log(
        `Updating from ${startYear} to ${endYear}, month ${month}; showing ${currentYear}`
      );
      temperature.source.fetch(startYear, endYear);
      await renderTemperature();
    })();
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-rows: 4rem auto 8rem;
  }

  .maps {
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .year {
    text-align: center;
    font-size: 2rem;
    line-height: 2rem;
    font-style: italic;
    text-transform: uppercase;
    padding: 1rem 0;
  }

  .info {
    display: grid;
    grid-template-columns: 50% 50%;
  }

  .info > div {
    text-align: center;
    max-width: 30rem;
    width: 100%;
    margin: 1rem auto;
  }

  .map {
    width: 50%;
    height: 100%;
  }
</style>

<div class="container">
  <div class="year">Year {currentYear}</div>

  <div class="maps">
    <div class="map" id="temperature-map" />
    <div class="map" id="birds-map" />
  </div>

  <div class="info">
    <div>
      <strong>Maximum Temperature</strong>
      <Scale
        colors={TEMPERATURE_SCALE_COLORS}
        domain={TEMPERATURE_SCALE_DOMAIN}
        unit="°C" />
    </div>

    <div>
      <strong>Birds Density</strong>
      <Scale colors={['#bdc3c7', '#2980b9']} domain={[1, 2, 3, 4]} unit="k" />
    </div>
  </div>
</div>
