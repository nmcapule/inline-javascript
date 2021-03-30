<script lang="ts">
  import RenderLogs from "./components/RenderLogs.svelte";
  import ScriptDrop from "./components/ScriptDrop.svelte";
  import Executor from "./vm/executor";

  export let snippet = `\
// debug.enabled = false;

const watch = new Date();
for (let i = 0; i < 100; i++) {
  await debug.wait(10);
  console.log("------------");
  // await debug.wait(i * 200);
  // await debug.wait(() => console.log("----- HERE -----"));
  await debug.wait({
    ms: i,
    preamble: () => console.log("before", i),
    callback: () => console.log("after", i),
  })
}

return \`executed for \${new Date() - watch} ms\`
`;
  export let logs = [];

  function logger(level: string, ...args) {
    const message = args
      .map((arg) => (JSON.stringify(arg) || "").replace(/^"(.+)"$/g, "$1"))
      .join(" ");
    logs = [...logs, { level, message }];
  }

  let vm: Executor;
  async function execute(code: string) {
    logs = [];
    const hash = code
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    logger(
      "INFO",
      "📝 executing JS: ",
      new Date(),
      Object.values(new TextEncoder().encode("" + hash))
    );

    vm = new Executor({
      logger,
      console: {
        trace: (...args) => logger("TRACE", ...args),
        log: (...args) => logger("INFO", ...args),
        warn: (...args) => logger("WARN", ...args),
        error: (...args) => logger("ERROR", ...args),
      },
    });
    try {
      const result = await vm.execute(code);
      logger("INFO", "📦 return value: ", result);
    } catch (err) {
      logger("ERROR", "💀 error 💀:", err.stack);
    } finally {
      vm?.destroy();
      vm = null;
    }
  }

  async function resume() {
    if (vm) vm.resume();
  }

  async function panic() {
    if (vm) {
      vm.panic();
      vm = null;
    }
  }
</script>

<main>
  <div class="controls">
    <code>Ctrl + Enter</code> to
    <button on:click={() => execute(snippet)} disabled={!!vm}>Execute</button>
    <button on:click={() => resume()} disabled={!vm}>Resume</button>
    <code>Ctrl + x</code> to
    <button on:click={() => panic()} disabled={!vm}>Panic</button>
  </div>
  <div class="sandbox">
    <ScriptDrop
      class="column"
      bind:snippet
      on:execute={(c) => (!vm ? execute(snippet) : resume())}
      on:panic={() => panic()}
    />
    <RenderLogs class="column" {logs} />
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
