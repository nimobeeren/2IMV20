<script>
  import { getContext } from "svelte";
  import L from "leaflet";

  export let lat;
  export let lon;
  export let size = 1;
  export let color;

  const { getMap } = getContext(L);

  $: {
    const map = getMap();
    if (lat && lon && map) {
      const coord = [
        [lat, lon],
        [lat + size, lon + size],
      ];
      const options = {
        color,
        weight: 0,
        fillOpacity: 100,
      };
      L.rectangle(coord, options).addTo(map);
    }
  }
</script>
