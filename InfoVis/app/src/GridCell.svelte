<script>
  import { getContext, onDestroy } from "svelte";
  import L from "leaflet";

  export let lat;
  export let lon;
  export let size = 1;
  export let color;

  let layer;

  const { getMap } = getContext(L);

  $: {
    const map = getMap();
    if (lat && lon && map) {
      // Remove the old layer if there is one
      if (layer) {
        layer.remove();
      }

      // Add a new layer
      const coord = [
        [lat, lon],
        [lat + size, lon + size],
      ];
      const options = {
        weight: 0,
        fillOpacity: 100,
        pane: "tilePane", // hack: moves the layer behind map geometry
      };
      // @ts-ignore
      layer = L.rectangle(coord, options).addTo(map);
    }
  }

  // Update layer color when color prop changes
  $: if (layer) {
    layer.setStyle({ color });
  }

  onDestroy(() => {
    if (layer) {
      layer.remove();
    }
  });
</script>
