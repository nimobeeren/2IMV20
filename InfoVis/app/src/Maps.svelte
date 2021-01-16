<script>
  import { onMount } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";

  import Scale from "./Scale.svelte";
  import LeafletMap from "./LeafletMap.svelte";
  import MapGeometry from "./MapGeometry.svelte";
  import { LATITUDE_RANGE, LONGITUDE_RANGE, BOUNDS } from "./utils";
  import {
    Gistemp,
    SCALE_DOMAIN as TEMPERATURE_SCALE_DOMAIN,
    SCALE_COLORS as TEMPERATURE_SCALE_COLORS,
  } from "./gistemp";

  export let year, minYear, maxYear, month;

  let prevYear, prevMinYear, prevMaxYear, prevMonth;
  let prevWindowHeight, prevWindowWidth;
  let windowHeight, windowWidth;
  let ready = false;
  let loading = true;

  // const GRID_OPTS = {
  //   color: "transparent",
  //   weight: 0,
  //   fillOpacity: 100,
  // };

  // const temp = {
  //   source: new Gistemp(),
  //   grid: {},
  // };

  // const birds = {
  //   grid: [],
  // };

  let geometryData;
  onMount(async () => {
    geometryData = await (await fetch("/data/map.json")).json();
  });

  onMount(async () => {
    // Draw rectangles for temperature grid
    // for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat += 2) {
    //   temp.grid[lat] = {};

    //   for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon += 2) {
    //     const coord = [
    //       [lat, lon],
    //       [lat + 2, lon + 2],
    //     ];

    //     // temp.grid[lat][lon] = L.rectangle(coord, GRID_OPTS).addTo(temp.map);
    //   }
    // }

    // await temp.source.fetch(minYear, maxYear);

    ready = true;
    loading = false;
  });

  // async function renderTemperature() {
  //   if (!temp.map) return;

  //   const yearData = await temp.source.get(year);
  //   const data = yearData[month - 1];

  //   for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat += 2) {
  //     for (let lon = LONGITUDE_RANGE[0]; lon <= LONGITUDE_RANGE[1]; lon += 2) {
  //       if (data[lat] && data[lat][lon]) {
  //         temp.grid[lat][lon].setStyle({
  //           color: data[lat][lon].c,
  //         });
  //       } else {
  //         temp.grid[lat][lon].setStyle({ color: "transparent" });
  //       }
  //     }
  //   }
  // }

  // $: {
  //   (async () => {
  //     if (!ready || loading) {
  //       return;
  //     }

  //     if (windowHeight != prevWindowHeight || windowWidth != prevWindowWidth) {
  //       prevWindowHeight = windowHeight;
  //       prevWindowWidth = windowWidth;
  //       // fitBounds();
  //     }

  //     if (minYear != prevMinYear || maxYear != prevMaxYear) {
  //       prevMinYear = minYear;
  //       prevMaxYear = maxYear;
  //       loading = true;
  //       // await temp.source.fetch(minYear, maxYear);
  //       loading = false;
  //     }

  //     if (year != prevYear || month != prevMonth) {
  //       prevMonth = month;
  //       prevYear = year;
  //       // await renderTemperature();
  //     }
  //   })();
  // }
</script>

<style>
  .outer {
    width: 100%;
    padding-top: 95%;
    position: relative;
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
    <div class="year">Year {year}</div>

    <div class="maps">
      <LeafletMap>
        <MapGeometry data={geometryData} />
        <!-- <TemperatureGrid data={temperatureData} /> -->
      </LeafletMap>
      <LeafletMap>
        <MapGeometry data={geometryData} />
        <!-- <BirdGrid data={birdData} /> -->
      </LeafletMap>

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
