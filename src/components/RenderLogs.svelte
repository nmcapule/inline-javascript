<script lang="ts">
  let container: HTMLElement;

  export let logs = [];

  $: (async (_) => {
    await new Promise((ok, _) => setTimeout(ok, 0));
    container?.lastElementChild?.scrollIntoView();
  })(logs);
</script>

<div class="logger monospace {$$props.class}" bind:this={container}>
  {#each logs as log}
    <div
      class="log"
      class:trace={log.level === "TRACE"}
      class:info={log.level === "INFO"}
      class:warn={log.level === "WARN"}
      class:error={log.level === "ERROR"}
    >
      {log.message.replaceAll("\\n", "\n").replaceAll("\\", "")}
    </div>
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
    white-space: pre-wrap;
  }

  .logger > .log {
    border-bottom: 1px solid #efefef;
  }

  .logger > .log.trace {
    color: #a6a6a6;
  }
  .logger > .log.info {
    color: #3a3a3a;
  }
  .logger > .log.warn {
    color: #f1c0a0;
  }
  .logger > .log.error {
    color: #d29abc;
  }
</style>
