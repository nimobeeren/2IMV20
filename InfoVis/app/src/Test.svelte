<script>
  import { onMount } from "svelte";

  let observations;
  onMount(async () => {
    const res = await fetch("/data/ebird/ebd_export.csv");
    const raw = await res.text();
    observations = raw.split("\n");
  });
</script>

<div>{observations?.length ?? 'loading...'}</div>
