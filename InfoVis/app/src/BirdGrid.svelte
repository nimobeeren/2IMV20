<script context="module">
  import { scaleLog } from "d3-scale";

  export const scale = scaleLog()
    .base(10)
    .domain([1, 100])
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
      const [lat, lon, intensity] = cell;

      // Map intensity to color scale
      let percent = intensity * 100;
      return { lat, lon, color: scale(percent) };
    });
  }
</script>

{#if grid}
  {#each grid as cell}
    <GridCell lat={cell.lat} lon={cell.lon} color={cell.color} />
  {/each}
{/if}
