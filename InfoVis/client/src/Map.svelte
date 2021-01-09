<script>
  import { geoPath, geoMercator } from "d3-geo";
  import { onMount } from "svelte";

  let width;
  let height;
  let earth;
  let pathData;

  const projection = geoMercator();
  const path = geoPath().projection(projection);

  // Get Earth geometry data
  onMount(async function () {
    const response = await fetch(
      "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_admin_0_countries.json"
    );
    earth = await response.json();
    pathData = path(earth);
  });

  // Resize the map if needed
  $: {
    projection.fitSize([width, height], earth);
    pathData = path(earth);
  }
</script>

<style>
  div {
    max-width: 960px;
    height: 500px;
    margin: 0 auto;
    border: 1px solid orange;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .border {
    stroke: #444;
    fill: #ccc;
  }
</style>

<div bind:clientWidth={width} bind:clientHeight={height}>
  <svg>
    <path class="border" d={pathData} />
  </svg>
</div>
