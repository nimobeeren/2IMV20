<script context="module">
  import { scaleLog } from "d3-scale";

  export const scale = scaleLog()
    .domain([1, 100])
    // @ts-ignore
    .range(["white", "blue"])
    .clamp(true);
</script>

<script>
  import GridCell from "./GridCell.svelte";

  export let data;

  let grid;

  $: if (data) {
    grid = data.map((cell) => {
      // Parse data, this depends on the JSON structure
      const [lat, lon, frequency] = cell;

      // Map frequency to color scale
      let percent = frequency * 100;
      return { lat, lon, color: scale(percent) };
    });
  }
</script>

{#if grid}
  {#each grid as cell}
    <GridCell lat={cell.lat} lon={cell.lon} color={cell.color} size={4} />
  {/each}
{/if}
