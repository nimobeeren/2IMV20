<script>
  import { onMount } from "svelte";
  import Scale from "./Scale.svelte";
  import LeafletMap from "./LeafletMap.svelte";
  import MapGeometry from "./MapGeometry.svelte";
  import TemperatureGrid from "./TemperatureGrid.svelte";
  import {
    Gistemp,
    SCALE_DOMAIN as TEMPERATURE_SCALE_DOMAIN,
    SCALE_COLORS as TEMPERATURE_SCALE_COLORS,
  } from "./gistemp";
  import { MIN_YEAR, MAX_YEAR } from "./utils";

  export let year;
  export let month;

  let windowHeight, windowWidth;
  let loading = true;

  let geometryData;
  let temperatureData;

  const temperatureSource = new Gistemp();

  onMount(async () => {
    geometryData = await fetch("/data/map.json").then((res) => res.json());

    // Prefetch all the temperature data
    await temperatureSource.fetch(MIN_YEAR, MAX_YEAR);
    temperatureData = temperatureSource.get(year, month);

    loading = false;
  });

  // Update temperature when year/month change
  $: temperatureData = temperatureSource.get(year, month);
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
        <TemperatureGrid data={temperatureData} />
        <MapGeometry data={geometryData} />
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
