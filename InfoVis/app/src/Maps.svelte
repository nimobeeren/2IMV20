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

<div class="outer" id="graph">
  <div class="inner">
    <div class="loading" style="display: {loading ? 'flex' : 'none'}">
      Loading...
    </div>
    <div class="year">Year {year}</div>

    <div class="maps">
      <LeafletMap options={{ attributionControl: false }}>
        <TemperatureGrid data={temperatureData} />
        <MapGeometry data={geometryData} />
      </LeafletMap>
      <LeafletMap>
        <MapGeometry data={geometryData} />
        <BirdGrid data={birdData} />
      </LeafletMap>

      <div class="info">
        <strong>Temperature Anomaly</strong>
        <Scale scale={temperatureScale} unit="°C" />
      </div>

      <div class="info">
        <strong>Birds Density</strong>
        <Scale scale={birdScale} unit="%" />
      </div>
    </div>
  </div>
</div>
