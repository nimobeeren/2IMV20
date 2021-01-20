<script>
  import { onMount } from "svelte";
  import Scale from "./Scale.svelte";
  import LeafletMap from "./LeafletMap.svelte";
  import MapGeometry from "./MapGeometry.svelte";
  import TemperatureGrid, {
    scale as temperatureScale,
  } from "./TemperatureGrid.svelte";
  import BirdGrid, { scale as birdScale } from "./BirdGrid.svelte";
  import { Gistemp } from "./gistemp";
  import { MIN_YEAR, MAX_YEAR } from "./utils";

  export let year;
  export let month;

  let geometryData;
  let temperatureData;
  let allBirdData;
  let birdData;
  let loading = true;

  const temperatureSource = new Gistemp();

  onMount(async () => {
    geometryData = await fetch("/data/map.json").then((res) => res.json());

    // Prefetch all the temperature data
    await temperatureSource.fetch(MIN_YEAR, MAX_YEAR);
    temperatureData = temperatureSource.get(year, month);

    allBirdData = await fetch("/data/ebird/ebd_grid.json").then((res) =>
      res.json()
    );

    loading = false;
  });

  // Update temperature when year/month change
  $: temperatureData = temperatureSource.get(year, month);

  // Update bird data when year/month change
  $: if (allBirdData) {
    birdData = allBirdData[year]?.[month - 1];
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

<div class="outer" id="graph">
  <div class="inner">
    <div class="title">{numToMonth(month)} of {year}</div>

    <div class="maps">
      <LeafletMap options={{ zoomControl: true, attributionControl: false }}>
        <TemperatureGrid data={temperatureData} />
        <MapGeometry data={geometryData} />
      </LeafletMap>
      <LeafletMap>
        <MapGeometry data={geometryData} />
        <BirdGrid data={birdData} />
      </LeafletMap>

      <div class="info">
        <strong>Temperature anomaly</strong>
        <Scale scale={temperatureScale} unit="°C" />
      </div>

      <div class="info">
        <strong>Bird density</strong>
        <Scale scale={birdScale} unit="%" />
      </div>
    </div>
  </div>
</div>
