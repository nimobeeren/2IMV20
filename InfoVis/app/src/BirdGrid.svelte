<script context="module">
  import { scaleLinear } from "d3-scale";

  export const scale = scaleLinear().domain([0, 1]).range(["white", "red"]);
</script>

<script>
  import GridCell from "./GridCell.svelte";

  export let data;

  let grid;

  // Parse data and map intensities to the color scale
  $: if (data) {
    grid = data.map((cell) => {
      let [lat, lon, intensity] = cell;
      return { lat, lon, color: scale(intensity) };
    });
  }
</script>

{#if grid}
  {#each grid as cell}
    <GridCell lat={cell.lat} lon={cell.lon} color={cell.color} />
  {/each}
{/if}
