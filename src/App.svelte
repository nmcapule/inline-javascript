<svelte:options tag="jsvm-repl" />

<script lang="ts">
  import { writable } from "svelte/store";

  import RenderLogs from "./components/RenderLogs.svelte";
  import ScriptDrop from "./components/ScriptDrop.svelte";
  import Executor from "./vm/executor";
  import Logger from "./vm/logger";

  export let snippet = `\
console.log("hi 👋");
await debug.wait(3000);
console.warn("bye 🙋‍♂️")`;

  let vm: Executor;
  let logger: Logger;
  let logs = writable([]);

  async function execute(code: string) {
    logger = new Logger(logs.set);
    logger.info("📝 executing JS: ", new Date());

    vm = new Executor({ console: logger });
    try {
      const result = await vm.execute(code);
      logger.info("📦 return value: ", result);
    } catch (err) {
      logger.error("💀 error 💀:", err.stack);
    } finally {
      vm?.destroy();
      vm = null;
    }
  }

  async function loadScript(url: string) {
    try {
      snippet = await fetch(url).then(async (res) => await res.text());
    } catch (e) {
      logger.error(e);
    }
  }
</script>

<main>
  <div class="controls">
    <button on:click={() => (vm ? vm.resume() : execute(snippet))}>
      <code>Ctrl + Enter</code> to Execute / Resume
    </button>

    <button on:click={() => vm?.panic()} disabled={!vm}>
      <code>Ctrl + q</code> to Panic
    </button>

    <button on:click={() => loadScript(prompt("Input URL"))}>
      Load script from URL
    </button>
    <button on:click={() => loadScript("samples/simple.js")}>
      Load <code>simple.js</code>
    </button>
    <button on:click={() => loadScript("samples/sorter.js")}>
      Load <code>sorter.js</code>
    </button>
    <button on:click={() => loadScript("samples/textadventure.js")}>
      Load <code>textadventure.js</code>
    </button>
  </div>
  <div class="sandbox">
    <ScriptDrop
      class="column"
      bind:snippet
      on:execute={(c) => (vm ? vm.resume() : execute(snippet))}
      on:panic={() => vm?.panic()}
    />

    <RenderLogs class="column" logs={$logs} />
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 48px);
    max-height: calc(100vh - 48px);
  }

  .controls {
    background-color: #f3f3f3;
  }

  .sandbox {
    display: flex;
    flex-grow: 1;
  }

  .sandbox > :global(.column) {
    flex: 1;
    overflow-x: auto;
    max-height: calc(100vh - 96px);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  @media (max-width: 640px) {
    .sandbox {
      flex-direction: column;
    }
  }
</style>
