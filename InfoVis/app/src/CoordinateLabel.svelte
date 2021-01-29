<script>
  import { getContext, onDestroy, onMount } from "svelte";
  import L from "leaflet";

  export let lat;

  let map;
  let layer;
  let lon;

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

  $: if (lat && lon && map) {
    // Remove the old layer if there is one
    if (layer) {
      layer.remove();
    }

    // Add a new layer
    const options = {
      icon: L.divIcon({
        html: `<div class="map-coordinate-label-content">${lat}&deg;</div>`,
        className: "map-coordinate-label",
      }),
    };
    layer = L.marker([lat, lon], options).addTo(map);
  }
</script>
