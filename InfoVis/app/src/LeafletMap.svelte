<script>
  import { onDestroy, onMount, setContext } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { debounce } from "lodash-es";
  import { BOUNDS } from "./utils.js";

  export let options = {};

  const defaultOptions = {
    zoomControl: false,
    maxBounds: BOUNDS,
    zoomSnap: 0.1,
  };

  let mapObject;
  let mapElement;
  let width;
  let height;
  let debouncedFitBounds;

  setContext(L, {
    getMap: () => mapObject,
  });

  onMount(() => {
    // Debounce this method to prevent running it too often
    debouncedFitBounds = debounce(() => {
      mapObject.fitBounds(BOUNDS);
    }, 100);

    mapObject = L.map(mapElement, { ...defaultOptions, ...options });
    debouncedFitBounds();
  });

  onDestroy(() => {
    debouncedFitBounds.cancel();
  });

  $: if (mapObject) {
    width = width;
    height = height;
    debouncedFitBounds();
  }
</script>

<div bind:this={mapElement} bind:clientWidth={width} bind:clientHeight={height}>
  <slot />
</div>
