<script lang="ts">
  import hljs from "highlight.js/lib/core";
  import javascript from "highlight.js/lib/languages/javascript";
  import "highlight.js/styles/atom-one-dark.css";
  import { CodeJar } from "codejar";
  import { onMount } from "svelte";

  hljs.registerLanguage("javascript", javascript);
  let editor;

  export let snippet = "";

  onMount(() => {
    const jar = CodeJar(editor, (elem: HTMLElement) => {
      snippet = elem.textContent;
      elem.innerHTML = hljs.highlight(elem.textContent, {
        language: "javascript",
      }).value;
    });
  });
</script>

<div bind:this={editor} class="hljs editor">{snippet}</div>

<style>
  .hljs.editor {
    text-align: left;
    border-radius: 6px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    font-weight: 400;
    height: 340px;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 4;
  }
</style>
