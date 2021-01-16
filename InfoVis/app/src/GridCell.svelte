<script>
  import { getContext } from "svelte";
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

  // TODO: update position when lat/lon change

  // Update layer color when color prop changes
  $: layer.setStyle({ color });
</script>
