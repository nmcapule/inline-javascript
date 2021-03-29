<script lang="ts">
  import ScriptDrop from "./components/ScriptDrop.svelte";
  import Executor from "./execute/executor";

  export let snippet = `\
function hello() {
	console.log("packet")
}

hello();
`;
  export let logs = [];

  function logger(...args) {
    const serialized = args
      .map((arg) => (JSON.stringify(arg) || "").replace(/^"(.+)"$/g, "$1"))
      .join(" ");
    logs = [...logs, serialized];
  }

  async function execute(code: string) {
    logs = [];
    const hash = code
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    logger(
      "executing 📝: ",
      new Date(),
      Object.values(new TextEncoder().encode("" + hash))
    );
    new Executor({ logger, console: { log: logger } }).execute(code);
  }
</script>

<main>
  <div style="margin-bottom: 10px">
    Press <code>Ctrl + Enter</code> to run your JS snippet
  </div>
  <ScriptDrop bind:snippet {logs} on:execute={(c) => execute(c.detail)} />
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
