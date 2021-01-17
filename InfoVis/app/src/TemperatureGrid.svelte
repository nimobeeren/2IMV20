<script context="module">
  export const SCALE_DOMAIN = [-4, -2, 0, 2, 4];
  export const SCALE_COLORS = [
    "#2980b9",
    "#3498db",
    "#ecf0f1",
    "#f1c40f",
    "#c0392b",
  ];
</script>

<script>
  import { scaleLinear } from "d3-scale";
  import GridCell from "./GridCell.svelte";
  import { LATITUDE_RANGE, LONGITUDE_RANGE } from "./utils";

  const scale = scaleLinear().domain(SCALE_DOMAIN).range(SCALE_COLORS);

  export let data;

  let gridCells = [];
  $: {
    if (data) {
      gridCells = [];
      for (let lat = LATITUDE_RANGE[0]; lat <= LATITUDE_RANGE[1]; lat += 2) {
        for (
          let lon = LONGITUDE_RANGE[0];
          lon <= LONGITUDE_RANGE[1];
          lon += 2
        ) {
          const temperature = data[lat]?.[lon];
          gridCells.push({
            lat,
            lon,
            color: temperature != null ? scale(temperature) : "transparent",
          });
        }
      }
    }
  }
</script>

{#each gridCells as cell}
  <GridCell lat={cell.lat} lon={cell.lon} color={cell.color} size={2} />
{/each}
