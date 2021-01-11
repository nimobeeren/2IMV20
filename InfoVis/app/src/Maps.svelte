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

  const CENTER = [35.775972, 17.636095];

  const temperature = {
    source: new Terraclimate(),
    map: null,
    grid: {},
  };

  const birds = {
    map: null,
    grid: {},
  };

  function blackout(map) {
    L.rectangle(
      [
        [-90, -180],
        [90, -30],
      ],
      { color: "black", weight: 0, fillOpacity: 0.5 }
    ).addTo(map);
    L.rectangle(
      [
        [-90, 60],
        [90, 180],
      ],
      { color: "black", weight: 0, fillOpacity: 0.5 }
    ).addTo(map);
  }

  onMount(() => {
    temperature.map = L.map("temperature-map", {
      attributionControl: false,
    }).setView(CENTER, 3);
    birds.map = L.map("birds-map", { zoomControl: false }).setView(CENTER, 3);

    temperature.map.sync(birds.map);
    birds.map.sync(temperature.map);

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    ).addTo(temperature.map);

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(birds.map);

    blackout(temperature.map);
    blackout(birds.map);

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat++) {
      temperature.grid[lat] = {};
      birds.grid[lat] = {};

      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon++) {
        temperature.grid[lat][lon] = L.rectangle(
          [
            [lat, lon],
            [lat + 1, lon + 1],
          ],
          { color: "transparent", weight: 0, fillOpacity: 0.7 }
        ).addTo(temperature.map);
        birds.grid[lat][lon] = L.rectangle(
          [
            [lat, lon],
            [lat + 1, lon + 1],
          ],
          { color: "transparent", weight: 0, fillOpacity: 0.7 }
        ).addTo(birds.map);
      }
    }
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

  export let currentYear;
  export let startYear;
  export let endYear;
  export let month;
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
