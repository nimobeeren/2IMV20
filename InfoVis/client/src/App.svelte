<script>
  import { FIRST_YEAR, LAST_YEAR, MONTHS } from "./utils";
  import Maps from "./Maps.svelte";

  let yearRange = false;
  let currentYear = FIRST_YEAR;
  let startYear = FIRST_YEAR;
  let endYear = FIRST_YEAR;
  let month = 3;
  let playing = false;
  let frequency = 1000;

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), time);
    });
  }

  async function play() {
    currentYear = startYear;
    await wait(frequency);

    while (currentYear < endYear && playing) {
      currentYear++;
      await wait(frequency);
    }

    playing = false;
  }

  $: {
    if (!yearRange) {
      endYear = startYear;
    }

    if (playing) {
      play();
    } else {
      currentYear = startYear;
    }
  }
</script>

<style>
  main {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 20rem auto;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0 0 1rem;
  }

  .sidebar {
    padding: 1rem;
  }
  #controls {
    display: grid;
    grid-template-columns: 5rem auto;
    grid-template-rows: 1rem;
    align-items: center;
    margin: 1rem 0;
    grid-auto-rows: minmax(min-content, max-content);
    grid-gap: 1rem;
  }
</style>

<svelte:head>
  <title>Climate Change and Bird Migration</title>
</svelte:head>
<main>
  <div class="sidebar">
    <h1>Climate Change and Bird Migration</h1>

    <div id="controls">
      <input
        type="checkbox"
        id="year-range"
        disabled={playing}
        bind:checked={yearRange} />
      <label for="year-range">Animate a range of years</label>

      <label for="month">Month</label>
      <select disabled={playing} id="month" bind:value={month}>
        {#each MONTHS as month, i}
          <option value={i + 1}>{month}</option>
        {/each}
      </select>

      <label for="start-year">{#if yearRange}Start year{:else}Year{/if}</label>
      <select id="start-year" bind:value={startYear} disabled={playing}>
        {#each { length: LAST_YEAR - FIRST_YEAR + 1 } as _, i}
          <option value={i + FIRST_YEAR}>{i + FIRST_YEAR}</option>
        {/each}
      </select>

      {#if yearRange}
        <label for="end-year">End year</label>
        <select disabled={playing} id="end-year" bind:value={endYear}>
          {#each { length: LAST_YEAR - startYear + 1 } as _, i}
            <option value={i + startYear}>{i + startYear}</option>
          {/each}
        </select>

        <label for="frequency">Frequency ({frequency} ms)</label>
        <input
          type="range"
          id="frequency"
          min="250"
          max="2000"
          bind:value={frequency} />

        <span><!-- i am important. leave me here --></span>
        <button
          on:click={() => {
            playing = !playing;
          }}>{#if playing}Stop{:else}Start{/if}</button>
      {/if}
    </div>
  </div>

  <Maps {currentYear} {startYear} {endYear} {month} />
</main>
