<script>
  import {
    onDestroy,
    onMount,
    setContext,
    createEventDispatcher,
  } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { debounce } from "lodash-es";
  import { BOUNDS } from "./utils.js";

  export let options = {};

  let mapObject;
  let mapElement;
  let width;
  let height;
  let debouncedFitBounds;

  const defaultOptions = {
    zoomControl: false,
    maxBounds: BOUNDS,
    zoomSnap: 0.1,
  };

  const dispatch = createEventDispatcher();

  setContext(L, {
    getMap: () => mapObject,
  });

  function handleMoveEnd(e) {
    dispatch("moveend", e);
  }

  onMount(() => {
    // Debounce this method to prevent running it too often
    debouncedFitBounds = debounce(() => {
      mapObject.fitBounds(BOUNDS);
    }, 100);

    mapObject = L.map(mapElement, { ...defaultOptions, ...options });
    mapObject.on("moveend", handleMoveEnd);

    debouncedFitBounds();
  });

  onDestroy(() => {
    debouncedFitBounds.cancel();

    mapObject.off("moveend", handleMoveEnd);
  });

  $: if (mapObject) {
    width = width;
    height = height;
    debouncedFitBounds();
  }
</script>

<div bind:this={mapElement} bind:clientWidth={width} bind:clientHeight={height}>
  {#if mapObject}
    <slot />
  {/if}
</div>
