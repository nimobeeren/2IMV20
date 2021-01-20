<script>
  import { line, curveNatural, scaleLinear, extent, scaleTime } from "d3";
  import { onMount } from "svelte";
  import { numToMonth } from "./utils";

  export let startYear, endYear, month;
  export let latRange, lonRange;
  export let temperatureSource;

  let width, height;
  let extentX, xScale, extentY, yScale, xTicks, yTicks, xPath, yPath;
  let data = [];
  let ready = false;

  const margin = { bottom: 20, left: 30 };

  const path = line()
    // @ts-ignore
    .x((d) => xScale(d.x))
    // @ts-ignore
    .y((d) => yScale(d.y))
    .curve(curveNatural);

  onMount(() => {
    render();
    ready = true;
  });

  function render() {
    data = parseData();

    extentX = extent(data, (d) => d.x);
    extentY = extent(data, (d) => d.y);
    extentY[0] -= 0.2;
    extentY[1] += 0.2;

    xScale = scaleTime().domain(extentX).range([margin.left, width]);

    yScale = scaleLinear()
      .domain(extentY)
      .range([height - margin.bottom, 0]);

    xTicks = getTicks(extentX, Math.ceil((extentX[1] - extentX[0]) / 20), 1);
    yTicks = getTicks(extentY, 0.2, 10);

    xPath = `M${margin.left + 0.5},0V0H${width + 1}V0`;
    yPath = `M0,${height - margin.bottom}H0.5V0.5`;
  }

  function parseData() {
    let data = [];

    for (let year = startYear; year <= endYear; year++) {
      let sum = 0,
        i = 0;
      const monthData = temperatureSource.get(year, month);

      for (let lat = latRange[0]; lat <= latRange[1]; lat++) {
        for (let lon = lonRange[0]; lon <= lonRange[1]; lon++) {
          if (monthData?.[lat] && monthData?.[lat]?.[lon]) {
            sum += monthData[lat][lon];
            i++;
          }
        }
      }

      data.push({
        x: year,
        y: sum / i,
      });
    }

    return data;
  }

  function getTicks(extent, step, approx) {
    const start = Math.floor(extent[0] * approx) / approx;
    const end = Math.ceil(extent[1] * approx) / approx;

    let ticks = [];
    for (var i = start; i < end; i += step) {
      ticks.push(Math.round(i * approx) / approx);
    }

    return ticks;
  }

  $: {
    // console.log to force reaction to those variables
    console.log(
      width,
      height,
      startYear,
      endYear,
      month,
      latRange,
      lonRange,
      temperatureSource
    );
    render();
  }
</script>

<style>
  .outer {
    width: 100%;
    padding-top: 55%;
    position: relative;
    background-color: white;
    color: black;
    margin: 1rem 0;
    border: 1px dashed black;
  }

  .inner {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: grid;
    grid-template-rows: 3.25rem auto;
  }

  .container > div,
  svg {
    width: 100%;
    height: 100%;
  }

  .container {
    padding: 1rem;
  }

  .y-tick text {
    font-size: 0.6rem;
  }

  .x-tick text {
    font-size: 0.6rem;
  }

  .y-tick:first-of-type,
  .x-tick:first-of-type {
    display: none;
  }

  .title {
    text-align: center;
    font-size: 1.25rem;
    line-height: 1;
    margin: 1rem 0;
    font-weight: 400;
  }
</style>

<div class="outer">
  <div class="inner">
    <div class="title">
      Regional average anomaly for the month of
      {numToMonth(month)}
      from
      {startYear}
      to
      {endYear}
    </div>
    <div class="container">
      <div bind:clientWidth={width} bind:clientHeight={height}>
        <svg>
          {#if ready}
            <g>
              <path d={path(data)} fill="none" stroke="#c0392b" />
            </g>

            <g transform="translate({margin.left}, 0)">
              <path stroke="currentColor" d={yPath} fill="none" />

              {#each yTicks as y}
                <g
                  class="y-tick"
                  opacity="1"
                  transform="translate(0,{yScale(y)})">
                  <!-- svelte-ignore component-name-lowercase -->
                  <line stroke="currentColor" x2="-5" />
                  <text dy="0.32em" fill="currentColor" x="-{margin.left}">
                    {y}
                  </text>
                </g>
              {/each}
            </g>

            <g transform="translate(0, {height - 20})">
              <path stroke="currentColor" d={xPath} fill="none" />

              {#each xTicks as x}
                <g
                  class="x-tick"
                  opacity="1"
                  transform="translate({xScale(x)},0)">
                  <!-- svelte-ignore component-name-lowercase -->
                  <line stroke="currentColor" y2="6" />
                  <text fill="currentColor" y="9" dy="0.71em" x="-13">{x}</text>
                </g>
              {/each}
            </g>
          {/if}
        </svg>
      </div>
    </div>
  </div>
</div>
