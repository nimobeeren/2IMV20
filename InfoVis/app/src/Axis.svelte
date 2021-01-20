<script>
  export let scale;
  export let numTicks;

  let width;
  let ticks;

  $: if (scale) {
    // Create a new scale to get the x-position of ticks
    const originalDomain = scale.domain();
    const xScale = scale
      .copy()
      .domain([originalDomain[0], originalDomain[originalDomain.length - 1]])
      .range([0, width]);

    ticks = scale.ticks(numTicks).map((tick) => ({
      value: tick,
      xOffset: xScale(tick),
    }));
  }
</script>

<style>
  svg {
    width: 100%;
    overflow: visible;
  }
</style>

<div bind:clientWidth={width}>
  {#if ticks}
    <svg>
      <!-- horizontal line -->
      <path d="M 0 0 H {width}" fill="none" stroke="currentColor" />
      <!-- ticks -->
      {#each ticks as { value, xOffset }}
        <g transform="translate({xOffset}, 0)">
          <line y2="6" stroke="currentColor" />
          <text transform="translate(0, 20)" text-anchor="middle">{value}</text>
        </g>
      {/each}
    </svg>
  {/if}
</div>
