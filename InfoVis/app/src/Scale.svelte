<script>
  export let scale;
  export let unit;
  export let numTicks = 5;

  let ticks;
  let colors;
  let background = "transparent";

  $: if (scale) {
    ticks = scale.ticks(numTicks);
    colors = ticks.map(scale);
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
    padding: 0 1rem;
    margin: 0.5rem 0px;
    width: 100%;
    box-sizing: border-box;
  }

  .domain {
    display: flex;
    justify-content: space-between;
    border-top: 2px solid black;
  }

  .top {
    flex-grow: 1;
  }

  .scale span {
    position: relative;
    margin-top: 10px;
  }

  .scale span::after {
    content: "";
    width: 2px;
    height: 10px;
    background: black;
    display: block;
    position: absolute;
    top: -10px;
    left: 50%;
  }

  .scale span:last-of-type::after {
    left: calc(50% - 2px);
  }

  .scale span:first-of-type {
    transform: translate(-50%, 0);
  }

  .scale span:last-of-type {
    transform: translate(50%, 0);
  }

  .units {
    margin-top: calc(2rem + 12px);
    margin-left: 18px;
    font-weight: bold;
  }
</style>

<div class="scale">
  <div class="top">
    <div class="bar" style="background: {background}" />
    <div class="domain">
      {#each ticks as tick}<span>{tick}</span>{/each}
    </div>
  </div>
  <div class="units">{unit}</div>
</div>
