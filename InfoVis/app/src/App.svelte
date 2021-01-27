<script>
  import {
    MIN_YEAR,
    MAX_YEAR,
    MONTHS,
    LATITUDE_RANGE,
    LONGITUDE_RANGE,
  } from "./utils";
  import Maps from "./Maps.svelte";
  import Graph from "./Graph.svelte";
  import { Gistemp } from "./gistemp";
  import { onMount } from "svelte";

  let startYear = MIN_YEAR;
  let endYear = MAX_YEAR;
  let year = MIN_YEAR;
  let month = 3;
  let playing = false;
  let yearsPerSecond = 2;
  let loading = true;
  let latRange = LATITUDE_RANGE,
    lonRange = LONGITUDE_RANGE;

  let geometryData, birdData;

  const temperatureSource = new Gistemp();

  onMount(async () => {
    geometryData = await fetch("/data/map.json").then((res) => res.json());

    // Prefetch all the temperature data
    await temperatureSource.fetch(MIN_YEAR, MAX_YEAR);

    birdData = await fetch(
      "/data/ebird/ebd_grid_barswa_1980_2019.json"
    ).then((res) => res.json());

    loading = false;
  });

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), time);
    });
  }

  function frequency() {
    return 1000 / yearsPerSecond;
  }

  function updateBounds(event) {
    const bounds = event.detail.target.getBounds();

    const newLat = [
      Math.floor(bounds.getSouth()),
      Math.ceil(bounds.getNorth()),
    ];
    const newLon = [Math.floor(bounds.getWest()), Math.ceil(bounds.getEast())];

    latRange = [
      Math.max(newLat[0], LATITUDE_RANGE[0]),
      Math.min(newLat[1], LATITUDE_RANGE[1]),
    ];
    lonRange = [
      Math.max(newLon[0], LONGITUDE_RANGE[0]),
      Math.min(newLon[1], LONGITUDE_RANGE[1]),
    ];
  }

  async function play() {
    year = startYear;
    await wait(frequency());

    while (year < endYear && playing) {
      year++;
      await wait(frequency());
    }

    playing = false;
  }

  $: {
    if (playing) {
      play();
    }
  }
</script>

<style>
  main {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 25rem auto;
    grid-gap: 2rem;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0 0 1rem;
  }

  .loading {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    color: white;
    justify-content: center;
    align-items: center;
    font-size: 6rem;
  }

  .sidebar {
    margin: 1rem 0;
  }
  #controls {
    display: grid;
    grid-template-columns: 6rem auto;
    grid-template-rows: 1rem;
    align-items: center;
    margin: 1rem 0;
    grid-auto-rows: minmax(min-content, max-content);
    grid-gap: 1rem;
  }

  .slider {
    display: grid;
    grid-template-columns: 7rem auto;
  }
</style>

<svelte:head>
  <title>Climate Change and Bird Migration</title>
</svelte:head>

<div class="loading" style="display: {loading ? 'flex' : 'none'}">
  Loading...
</div>

<main>
  <div class="sidebar">
    <h1>Climate Change and Bird Migration</h1>

    <div id="controls">
      <label for="start-year">Start Year</label>
      <select id="start-year" bind:value={startYear} disabled={playing}>
        {#each Array(MAX_YEAR - MIN_YEAR + 1) as _, i}
          <option value={i + MIN_YEAR}>{i + MIN_YEAR}</option>
        {/each}
      </select>

      <label for="end-year">End year</label>
      <select disabled={playing} id="end-year" bind:value={endYear}>
        {#each Array(MAX_YEAR - startYear + 1) as _, i}
          <option value={i + startYear}>{i + startYear}</option>
        {/each}
      </select>

      <label for="month">Month</label>
      <select disabled={playing} id="month" bind:value={month}>
        {#each MONTHS as month, i}
          <option value={i + 1}>{month}</option>
        {/each}
      </select>

      <label for="frequency">Years per second ({yearsPerSecond})</label>
      <input
        type="range"
        id="frequency"
        min="1"
        max="10"
        bind:value={yearsPerSecond} />

      <span><!-- i am important. leave me here --></span>
      <button
        on:click={() => {
          playing = !playing;
        }}>{#if playing}Stop{:else}Start{/if}</button>
    </div>

    <div class="slider">
      <label for="curr-year">View year ({year})</label>
      <input
        disabled={playing}
        type="range"
        id="curr-year"
        min={MIN_YEAR}
        max={MAX_YEAR}
        bind:value={year} />
    </div>
  </div>

  <div class="vis">
    {#if !loading}
      <Maps
        {year}
        {month}
        {geometryData}
        temperatureData={temperatureSource.get(year, month)}
        allBirdData={birdData}
        on:moveend={updateBounds} />

      <Graph
        {startYear}
        {endYear}
        {month}
        {latRange}
        {lonRange}
        {temperatureSource}
        {birdData} />
    {/if}
  </div>
</main>
