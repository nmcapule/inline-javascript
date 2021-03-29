<script lang="ts">
  export let logs = [];
</script>

<div class="logger monospace">
  {#each logs as log}
    <div class="log">{log}</div>
  {/each}
</div>

<style>
  .monospace {
    text-align: left;
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 4;
  }
</style>
