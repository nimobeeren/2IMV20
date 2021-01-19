<script>
  import L from "leaflet";
  import "leaflet.sync";
  import "leaflet/dist/leaflet.css";
  import { numToMonth } from "./utils";
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import { LATITUDE_RANGE, LONGITUDE_RANGE, BOUNDS } from "./utils";
  import {
    SCALE_DOMAIN as TEMPERATURE_SCALE_DOMAIN,
    SCALE_COLORS as TEMPERATURE_SCALE_COLORS,
  } from "./gistemp";
  import Scale from "./Scale.svelte";

  export let year, month;
  export let gistemp;

  let prevYear, prevMonth;
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
  };

  const GRID_OPTS = {
    color: "transparent",
    weight: 0,
    fillOpacity: 100,
  };

  const temp = {
    map: null,
    grid: {},
  };

  const birds = {
    map: null,
    grid: {},
  };

  onMount(async () => {
    temp.map = L.map("temperature-map", { ...MAP_OPTS, zoomControl: true });
    birds.map = L.map("birds-map", MAP_OPTS);

    fitBounds();

    temp.map.sync(birds.map);
    birds.map.sync(temp.map);

    addGrayLayer(temp.map);
    addGrayLayer(birds.map);

    temp.map.on("moveend", () => {
      const bounds = temp.map.getBounds();
      dispatch("bounds", {
        lat: [Math.floor(bounds.getSouth()), Math.ceil(bounds.getNorth())],
        lon: [Math.floor(bounds.getWest()), Math.ceil(bounds.getEast())],
      });
    });

    const map = await (await fetch("/data/map.json")).json();

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat += 2) {
      temp.grid[lat] = {};
      birds.grid[lat] = {};

      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon += 2) {
        const coord = [
          [lat, lon],
          [lat + 2, lon + 2],
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

  function addGrayLayer(map) {
    L.rectangle(
      [
        [-90, -180],
        [90, 180],
      ],
      {
        color: "lightgray",
        weight: 0,
        fillOpacity: 100,
      }
    ).addTo(map);
  }

  function renderTemperature() {
    if (!temp.map) return;

    const yearData = gistemp.get(year);
    const data = yearData[month - 1];

    for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat += 2) {
      for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon += 2) {
        if (data[lat] && data[lat][lon]) {
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
        prevWindowHeight = windowHeight;
        prevWindowWidth = windowWidth;
        fitBounds();
      }

      if (year != prevYear || month != prevMonth) {
        prevMonth = month;
        prevYear = year;
        renderTemperature();
      }
    })();
  }
</script>

<style>
  .outer {
    width: 100%;
    padding-top: 90%;
    position: relative;
    background-color: white;
    color: black;
    margin: 1rem 0;
    border: 1px dashed black;
  }

  .inner {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: grid;
    grid-template-rows: 3.25rem auto;
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

  .title {
    text-align: center;
    font-size: 1.25rem;
    line-height: 1;
    margin: 1rem 0;
    font-weight: 400;
  }
</style>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="outer" id="graph">
  <div class="inner">
    <div class="title">{numToMonth(month)} of {year}</div>

    <div class="maps">
      <div class="map" id="temperature-map" />
      <div class="map" id="birds-map" />

      <div class="info">
        <strong>Temperature Anomaly</strong>
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
