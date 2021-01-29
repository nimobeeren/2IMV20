<script>
  import { getContext, onDestroy } from "svelte";
  import L from "leaflet";

  export let layer;
  let currentLayer;

  let map;

  const { getMap } = getContext(L);
  $: map = getMap();

  $: if (map) {
    if (currentLayer) {
      currentLayer.remove();
    }

    layer.addTo(map);
    currentLayer = layer;
  }

  onDestroy(() => {
    currentLayer.remove();
  });
</script>
