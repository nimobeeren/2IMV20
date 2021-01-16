<script>
  import { onMount, setContext } from "svelte";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { BOUNDS } from "./utils.js";

  export let options = {};

  const defaultOptions = {
    zoomControl: false,
    maxBounds: BOUNDS,
    attributionControl: false,
    zoomSnap: 0.1,
    dragging: false,
    boxZoom: false,
    scrollWheelZoom: false,
    touchZoom: false,
    doubleClickZoom: false,
  };

  let mapObject;
  let mapElement;

  setContext(L, {
    getMap: () => mapObject,
  });

  onMount(async () => {
    mapObject = L.map(mapElement, { ...defaultOptions, ...options });
    mapObject.fitBounds(BOUNDS); // TODO: fit on resize
  });
</script>

<div bind:this={mapElement}>
  <slot />
</div>
