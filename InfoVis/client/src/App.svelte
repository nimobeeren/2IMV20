<script>
  import { FIRST_YEAR, LAST_YEAR, MONTHS } from "./utils";
  import Maps from "./Maps.svelte";

  let yearRange = false;
  let startYear = FIRST_YEAR;
  let endYear = FIRST_YEAR;
  let month = 3;

  $: {
    if (!yearRange) {
      endYear = startYear;
    }
  }
</script>

<style>
  main {
    padding: 1em;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  #controls {
    display: grid;
    grid-template-columns: 8rem 20rem;
    grid-template-rows: auto;
    align-items: center;
    grid-row-gap: 1rem;
    margin: 0 0 1rem 0;
  }
</style>

<svelte:head>
  <title>Climate Change and Bird Migraton</title>
</svelte:head>
<main>
  <div id="controls">
    <input type="checkbox" id="year-range" bind:checked={yearRange} />
    <label for="year-range">Animate a range of years</label>

    <label for="start-year">{#if yearRange}Start year{:else}Year{/if}</label>
    <select id="start-year" bind:value={startYear}>
      {#each { length: LAST_YEAR - FIRST_YEAR + 1 } as _, i}
        <option value={i + FIRST_YEAR}>{i + FIRST_YEAR}</option>
      {/each}
    </select>

    {#if yearRange}
      <label for="end-year">End year</label>
      <select id="end-year" bind:value={endYear}>
        {#each { length: LAST_YEAR - startYear + 1 } as _, i}
          <option value={i + startYear}>{i + startYear}</option>
        {/each}
      </select>

      <!-- TODO: animation interval -->
    {/if}

    <label for="month">Month</label>
    <select id="month" bind:value={month}>
      {#each MONTHS as month, i}
        <option value={i + 1}>{month}</option>
      {/each}
    </select>
  </div>

  <Maps {startYear} {endYear} {month} />
</main>
