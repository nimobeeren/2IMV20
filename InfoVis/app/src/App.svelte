<script>
  import { MIN_YEAR, MAX_YEAR, MONTHS } from "./utils";
  import Maps from "./Maps.svelte";

  let startYear = MIN_YEAR;
  let endYear = MAX_YEAR;
  let year = MIN_YEAR;
  let month = 3;
  let playing = false;
  let yearsPerSecond = 2;

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), time);
    });
  }

  function frequency() {
    return 1000 / yearsPerSecond;
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
    max-width: 900px;
    margin: 0 auto;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0 0 1rem;
  }

  .sidebar {
    padding: 1rem 0;
  }
  #controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
  }

  #controls > div {
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
<main>
  <div class="sidebar">
    <h1>Climate Change and Bird Migration</h1>

    <div id="controls">
      <div>
        <label for="start-year">Start Year</label>
        <select id="start-year" bind:value={startYear} disabled={playing}>
          {#each { length: MAX_YEAR - MIN_YEAR + 1 } as _, i}
            <option value={i + MIN_YEAR}>{i + MIN_YEAR}</option>
          {/each}
        </select>

        <label for="end-year">End year</label>
        <select disabled={playing} id="end-year" bind:value={endYear}>
          {#each { length: MAX_YEAR - startYear + 1 } as _, i}
            <option value={i + startYear}>{i + startYear}</option>
          {/each}
        </select>
      </div>

      <div>
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

  <Maps {year} {month} />
</main>
