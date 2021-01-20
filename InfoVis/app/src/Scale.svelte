<script>
  import Axis from "./Axis.svelte";

  export let scale;
  export let numTicks = 5;
  export let ticksOverride;

  let background = "none";

  $: if (scale) {
    const ticks = scale.ticks(numTicks);
    const colors = ticks.map(scale);
    background = `linear-gradient(to right, ${colors.join(", ")})`;
  }
</script>

<style>
  .scale .bar {
    width: 100%;
    height: 2rem;
  }

  .scale {
    display: flex;
    padding: 0 2rem;
    margin: 0.5rem 0px;
    width: 100%;
    box-sizing: border-box;
  }

  .top {
    flex-grow: 1;
  }
</style>

<div class="scale">
  <div class="top">
    <div class="bar" style="background: {background}" />
    <Axis {scale} {numTicks} {ticksOverride} />
  </div>
</div>
