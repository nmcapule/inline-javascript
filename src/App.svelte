<script lang="ts">
  import RenderLogs from "./components/RenderLogs.svelte";
  import ScriptDrop from "./components/ScriptDrop.svelte";
  import Executor from "./execute/executor";

  export let snippet = `\
debug.enabled = false;

const watch = new Date();
for (let i = 0; i < 10; i++) {
  await debug.sleep(i*10);
  console.log("packet", i);
  await debug.break();
}

return \`executed for \${new Date() - watch} ms\`
`;
  export let logs = [];

  function logger(...args) {
    const serialized = args
      .map((arg) => (JSON.stringify(arg) || "").replace(/^"(.+)"$/g, "$1"))
      .join(" ");
    logs = [...logs, serialized];
  }

  let vm: Executor;
  async function execute(code: string) {
    logs = [];
    const hash = code
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    logger(
      "📝 executing JS: ",
      new Date(),
      Object.values(new TextEncoder().encode("" + hash))
    );

    vm = new Executor({
      logger,
      console: { log: logger },
    });
    try {
      const result = await vm.execute(code);
      logger("📦 return value: ", result);
    } catch (err) {
      logger("💀 error 💀:", err.stack);
    } finally {
      vm.destroy();
      vm = null;
    }
  }

  async function resume() {
    if (vm) vm.resume();
  }
</script>

<main>
  <div style="margin-bottom: 10px">
    Press <code>Ctrl + Enter</code> to run your JS snippet or
    <button on:click={() => execute(snippet)} disabled={!!vm}>Execute</button>
    <button on:click={() => resume()} disabled={!vm}>Resume</button>
  </div>
  <ScriptDrop
    bind:snippet
    on:execute={(c) => (!vm ? execute(c.detail) : resume())}
  />
  <RenderLogs {logs} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
