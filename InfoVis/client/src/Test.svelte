<script>
  import { onMount } from "svelte";

  let observations;
  onMount(async () => {
    const res = await fetch("http://localhost:5001");
    const raw = await res.text();
    observations = raw.split("\n");
  });
</script>

<div>{observations?.length ?? 'loading...'}</div>
