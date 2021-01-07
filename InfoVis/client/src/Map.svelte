<script>
  import { geoPath, geoMercator } from "d3-geo";
  import { onMount } from "svelte";

  let data;

  onMount(async function () {
    const projection = geoMercator();
    projection.center([15, 15]);
    const path = geoPath().projection(projection);

    const response = await fetch(
      "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_admin_0_countries.json"
    );
    const json = await response.json();

    data = path(json);
  });
</script>

<style>
  svg {
    width: 960px;
    height: 500px;
  }
  .border {
    stroke: #444;
    fill: #ccc;
  }
</style>

<svg width="960" height="500">
  <path d={data} class="border" />
</svg>
