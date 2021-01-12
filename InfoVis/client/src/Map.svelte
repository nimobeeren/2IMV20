<script>
  import { geoPath, geoMercator } from "d3-geo";
  import { onMount } from "svelte";

  let viewW;
  let viewH;
  let earth;
  let pathData;

  const targetDeg = [
    [-30, 80], // top-left
    [60, -40], // bottom-right
  ];

  const projection = geoMercator();
  const path = geoPath().projection(projection);

  // Get Earth geometry data
  onMount(async function () {
    const response = await fetch("/data/earth.json");
    earth = await response.json();
    pathData = path(earth);
  });

  // Resize the map if needed
  $: {
    if (viewW !== undefined && viewH !== undefined) {
      const target = [
        projection(targetDeg[0]), // top-left
        projection(targetDeg[1]), // bottom-right
      ];
      const targetW = target[1][0] - target[0][0];
      const targetH = target[1][1] - target[0][1];

      // const centerPx = [target[0][0] + targetW / 2, target[0][1] + targetH / 2];
      // console.log(centerPx);
      // const center = projection([0, 1]);
      // console.log(center);
      // projection.translate([400, 200]);

      const currScale = projection.scale();
      const newScale = currScale * Math.min(viewW / targetW, viewH / targetH);
      projection.scale(newScale);

      pathData = path(earth);
    }
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

<div bind:clientWidth={viewW} bind:clientHeight={viewH}>
  <svg>
    <path class="border" d={pathData} />
  </svg>
</div>
