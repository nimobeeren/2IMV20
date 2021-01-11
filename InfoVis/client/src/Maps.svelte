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

    const yearData = await temperature.source.get(startYear);
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
      console.log(`Updating from ${startYear} to ${endYear}, month ${month}`);
      temperature.source.fetch(startYear, endYear);
      await renderTemperature();
    })();
  }

  export let startYear;
  export let endYear;
  export let month;
</script>

<style>
  .maps {
    display: flex;
    width: 100%;
    height: 80vh;
    margin: 0 auto;
  }

  .scales {
    display: grid;
    grid-template-columns: 50% 50%;
  }

  .map {
    width: 50%;
    height: 100%;
  }
</style>

<div>
  <div class="scales">
    <Scale
      colors={TEMPERATURE_SCALE_COLORS}
      domain={TEMPERATURE_SCALE_DOMAIN}
      unit="°C" />
    <Scale colors={['#bdc3c7', '#2980b9']} domain={[1, 2, 3, 4]} unit="k" />
  </div>

  <div class="maps">
    <div class="map" id="temperature-map" />
    <div class="map" id="birds-map" />
  </div>
</div>
