<script>
  import { getContext, onDestroy, onMount } from "svelte";
  import L from "leaflet";
  import LeafletLayer from "./LeafletLayer.svelte";

  export let lat;

  let map;
  let lon;
  let options;

  const { getMap } = getContext(L);
  $: map = getMap();

  function handleMove(event) {
    lon = event.target.getBounds().getEast();
  }

  onMount(() => {
    if (map) {
      lon = map.getBounds().getEast();
      map.on("move", handleMove);
    }
  });

  onDestroy(() => {
    if (map) {
      map.off("move", handleMove);
    }
  });

  $: options = {
    icon: L.divIcon({
      html: `<div class="map-coordinate-label-content">${lat}&deg;</div>`,
      className: "map-coordinate-label",
    }),
  };
</script>

{#if lat !== undefined && lon !== undefined}
  <LeafletLayer layer={L.marker([lat, lon], options)} />
{/if}
