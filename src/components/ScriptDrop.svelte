<script lang="ts">
  import hljs from "highlight.js/lib/core";
  import javascript from "highlight.js/lib/languages/javascript";
  import "highlight.js/styles/atom-one-dark.css";
  import { CodeJar } from "codejar";
  import { createEventDispatcher, onMount } from "svelte";

  hljs.registerLanguage("javascript", javascript);

  let editor: HTMLElement;
  let jar: CodeJar;
  const dispatch = createEventDispatcher();

  export let snippet = "";

  $: if (editor?.textContent !== snippet) jar?.updateCode(snippet);

  onMount(() => {
    jar = CodeJar(
      editor,
      (elem: HTMLElement) => {
        elem.innerHTML = hljs.highlight(elem.textContent, {
          language: "javascript",
        }).value;
      },
      {
        tab: "  ",
      }
    );
    jar.onUpdate((code) => (snippet = code));

    editor.focus();

    return jar.destroy;
  });

  function handleKeydown(event: KeyboardEvent) {
    // Make sure that the editor does not capture this key combination.
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
    }
  }
</script>

<div
  bind:this={editor}
  class="hljs editor monospace {$$props.class}"
  on:keydown={handleKeydown}
>
  {snippet}
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

  .editor {
    border-radius: 6px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
    min-height: 340px;
  }
</style>
