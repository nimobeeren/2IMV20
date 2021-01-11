<script>
  import { FIRST_YEAR, LAST_YEAR, MONTHS } from './consts'
  import Temperature from './Temperature.svelte'

  export let startYear = FIRST_YEAR;
  export let endYear;
  export let month;
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello!</h1>

  <label for="start-year">Start year</label>
  <select id="start-year" bind:value={startYear}>
    {#each {length: LAST_YEAR - FIRST_YEAR + 1} as _, i}
			<option value={i + FIRST_YEAR}>{i + FIRST_YEAR}</option>
		{/each}
  </select>

  <label for="end-year">End year</label>
  <select id="end-year" bind:value={endYear}>
    {#each {length: LAST_YEAR - startYear} as _, i}
			<option value={i + startYear + 1}>{i + startYear + 1}</option>
		{/each}
  </select>

  <label for="month">Month</label>
  <select id="month" bind:value={month}>
    {#each MONTHS as month, i}
			<option value={i + 1}>{month}</option>
		{/each}
  </select>

  <Temperature startYear={startYear} endYear={endYear} month={month} />
</main>
