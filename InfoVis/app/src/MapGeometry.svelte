<script>
  import { getContext } from "svelte";
  import L from "leaflet";

  export let data;
  export let options = {};

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
      L.geoJSON(data, { ...defaultOptions, ...options }).addTo(map);
    }
  }
</script>
