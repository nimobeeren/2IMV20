<script>
  import { LATITUDE_RANGE, LONGITUDE_RANGE, BOUNDS } from "./utils";
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

  export let currentYear, startYear, endYear, month;

  let prevCurrentYear, prevStartYear, prevEndYear, prevMonth;
  let prevWindowHeight, prevWindowWidth;
  let windowHeight, windowWidth;
  let ready = false;
  let loading = true;

  const DATA_LAYER_OPTS = {
    style: {
      color: "#333333",
      weight: 1,
      opacity: 1,
      fillOpacity: 0,
    },
  };

  const MAP_OPTS = {
    zoomControl: false,
    maxBounds: BOUNDS,
    attributionControl: false,
    zoomSnap: 0.1,
    dragging: false,
    boxZoom: false,
    scrollWheelZoom: false,
    touchZoom: false,
    doubleClickZoom: false,
  };

  const GRID_OPTS = {
    color: "transparent",
    weight: 0,
    fillOpacity: 1,
  };

  const temp = {
    source: new Terraclimate(),
    map: null,
    grid: {},
  };

  const birds = {
    map: null,
    grid: {},
  };

  onMount(async () => {
    temp.map = L.map("temperature-map", MAP_OPTS);
    birds.map = L.map("birds-map", MAP_OPTS);
    fitBounds();

    const map = await (await fetch("/data/map.json")).json();

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat++) {
      temp.grid[lat] = {};
      birds.grid[lat] = {};

      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon++) {
        const coord = [
          [lat - 1, lon],
          [lat, lon + 1],
        ];

        temp.grid[lat][lon] = L.rectangle(coord, GRID_OPTS).addTo(temp.map);
        birds.grid[lat][lon] = L.rectangle(coord, GRID_OPTS).addTo(birds.map);
      }
    }

    L.geoJSON(map, DATA_LAYER_OPTS).addTo(temp.map);
    L.geoJSON(map, DATA_LAYER_OPTS).addTo(birds.map);

    ready = true;
    loading = false;
  });

  function fitBounds() {
    temp.map.fitBounds(BOUNDS);
    birds.map.fitBounds(BOUNDS);
  }

  async function renderTemperature() {
    if (!temp.map) return;

    const yearData = await temp.source.get(currentYear);
    const data = yearData[month - 1];

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat++) {
      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon++) {
        if (data[lat][lon]) {
          temp.grid[lat][lon].setStyle({
            color: data[lat][lon].c,
          });
        } else {
          temp.grid[lat][lon].setStyle({ color: "transparent" });
        }
      }
    }
  }

  $: {
    (async () => {
      if (!ready || loading) {
        return;
      }

      if (windowHeight != prevWindowHeight || windowWidth != prevWindowWidth) {
        console.log(
          `Dimensions changed; width=${windowWidth} height=${windowHeight}`
        );
        prevWindowHeight = windowHeight;
        prevWindowWidth = windowWidth;
        fitBounds();
      }

      if (startYear != prevStartYear || endYear != prevEndYear) {
        console.log(`Range changed; startYear=${startYear} endYear=${endYear}`);
        prevStartYear = startYear;
        prevEndYear = endYear;
        loading = true;
        await temp.source.fetch(startYear, endYear);
        loading = false;
      }

      if (currentYear != prevCurrentYear || month != prevMonth) {
        console.log(`Year changed; currentYear=${currentYear} month=${month}`);
        prevMonth = month;
        prevCurrentYear = currentYear;
        await renderTemperature();
      }
    })();
  }
</script>

<style>
  .outer {
    width: 100%;
    padding-top: 95%;
    position: relative;
    border: 1px dashed black;
    background-color: white;
    color: black;
  }

  .inner {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: grid;
    grid-template-rows: 3.5rem auto;
  }

  .loading {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    z-index: 10000;
    color: white;
    justify-content: center;
    align-items: center;
    font-size: 6rem;
  }
  .maps {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto 8rem;
  }

  .info {
    text-align: center;
    max-width: 25rem;
    width: 100%;
    margin: 1rem auto 0;
  }

  .year {
    text-align: center;
    font-size: 1.5rem;
    line-height: 1;
    margin: 1rem 0;
    font-weight: bold;
  }
</style>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="outer" id="graph">
  <div class="inner">
    <div class="loading" style="display: {loading ? 'flex' : 'none'}">
      Loading...
    </div>
    <div class="year">Year {currentYear}</div>

    <div class="maps">
      <div class="map" id="temperature-map" />
      <div class="map" id="birds-map" />

      <div class="info">
        <strong>Maximum Temperature</strong>
        <Scale
          colors={TEMPERATURE_SCALE_COLORS}
          domain={TEMPERATURE_SCALE_DOMAIN}
          unit="°C" />
      </div>

      <div class="info">
        <strong>Birds Density</strong>
        <Scale colors={['#bdc3c7', '#2980b9']} domain={[1, 2, 3, 4]} unit="k" />
      </div>
    </div>
  </div>
</div>
