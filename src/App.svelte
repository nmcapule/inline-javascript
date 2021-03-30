<script lang="ts">
  import { writable } from "svelte/store";

  import RenderLogs from "./components/RenderLogs.svelte";
  import ScriptDrop from "./components/ScriptDrop.svelte";
  import Executor from "./vm/executor";
  import Logger from "./vm/logger";

  export let snippet = `\
// debug.enabled = false;

const watch = new Date();

const arr = Array.from({length:10})
	.map(Math.random)
	.map(x => parseInt(x*100));

for (let i = 0; i < arr.length-1; i++) {
	for (let j = i + 1; j < arr.length; j++) {
		await debug.wait(100);

		if (arr[i] > arr[j]) {
			const tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;

			console.clear();
			console.log(arr);
		}
	}
}

return \`executed for \${new Date() - watch} ms\`
`;

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
</script>

<main>
  <div class="controls">
    <button on:click={() => (vm ? vm.resume() : execute(snippet))}>
      <code>Ctrl + Enter</code> to Execute / Resume
    </button>

    <button on:click={() => vm?.panic()} disabled={!vm}>
      <code>Ctrl + q</code> to Panic
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
