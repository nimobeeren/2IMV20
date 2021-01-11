<script>
  import * as d3 from "d3";
  import { geoPath, geoMercator } from "d3-geo";
  import { onMount } from "svelte";
  import { Terraclimate } from "./terraclimate";

  let width;
  let height;
  let earth;
  let pathData;
  let temperatureLayer;

  const terraclimate = new Terraclimate();
  const projection = geoMercator();
  const path = geoPath().projection(projection);

  var colorScale = d3.scaleLinear()
    .domain([-10, 30])
    .range(['blue', 'red']);

  // Get Earth geometry data
  onMount(async function () {
    const response = await fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    );
    earth = await response.json();
    pathData = path(earth);
  });

  async function renderTemperature() {
    console.time('START_RENDER')
    const data = (await terraclimate.get(year))[month - 1].map((d) => {
      const [x, y] = projection([d.lon, d.lat]);
      const [x1, y2] = projection([d.lon + 1, d.lat + 1]);

      return {
        ...d,
        x,
        y,
        width: Math.abs(x1 - x),
        height: Math.abs(y2 - y),
      };
    });

    console.log(data);

    d3.select(temperatureLayer).selectAll("g").remove();

    d3.select(temperatureLayer)
      .selectAll("g")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .style("fill", d => colorScale(d.t))
      .attr("fill-opacity", 0.4);
    console.timeEnd('START_RENDER')
  }

  // Resize the map if needed
  $: {
    console.log('data changed')
    projection.fitSize([width, height], earth);
    pathData = path(earth);

    (async () => {
      terraclimate.fetch(startYear, endYear);
      await renderTemperature();
    })();
  }

  export let year;
  export let startYear;
  export let endYear;
  export let month;
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
    <g bind:this={temperatureLayer} id="temperature-group" />
  </svg>
</div>
