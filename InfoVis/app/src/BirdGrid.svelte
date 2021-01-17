<script>
  import GridCell from "./GridCell.svelte";

  export let data;
</script>

{#if data}
  {#each data as cell}
    <GridCell lat={cell[0]} lon={cell[1]} color="red" />
  {/each}
{/if}
