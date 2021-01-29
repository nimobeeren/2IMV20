<script>
  import { getContext, onDestroy } from "svelte";
  import L from "leaflet";

  export let data;
  export let options = {};

  let layer;

  const defaultOptions = {
    style: {
      color: "#333333",
      weight: 1,
      opacity: 1,
      fillOpacity: 0,
    },
  };

  const { getMap } = getContext(L);

  $: {
    const map = getMap();
    if (data && map) {
      if (layer) {
        layer.remove();
      }
      layer = L.geoJSON(data, { ...defaultOptions, ...options }).addTo(map);
    }
  }

  onDestroy(() => {
    if (layer) {
      layer.remove();
    }
  });
</script>
