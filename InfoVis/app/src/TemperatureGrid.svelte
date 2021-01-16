<script>
  import GridCell from "./GridCell.svelte";
  import { LATITUDE_RANGE, LONGITUDE_RANGE } from "./utils";

  export let data;

  let gridCells = [];
  $: {
    console.log({ data });
    if (data) {
      gridCells = [];
      for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat += 2) {
        for (
          let lon = LONGITUDE_RANGE[0];
          lon <= LONGITUDE_RANGE[1];
          lon += 2
        ) {
          gridCells.push({
            lat,
            lon,
            color: data?.[lat]?.[lon]?.c ?? "transparent",
          });
        }
      }
    }
  }
</script>

{#each gridCells as cell}
  <GridCell lat={cell.lat} lon={cell.lon} color={cell.color} size={2} />
{/each}
