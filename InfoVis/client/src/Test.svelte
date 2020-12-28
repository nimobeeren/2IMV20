<script>
  import { onMount } from "svelte";

  let observations;
  onMount(async () => {
    const res = await fetch("http://localhost:8080");
    const raw = await res.text();
    observations = raw.split("\n");
  });
</script>

<div>{observations?.length ?? 'loading...'}</div>
