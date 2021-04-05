import { Component, Host, h, Prop, Event, EventEmitter, Method } from '@stencil/core';
import { CodeJar } from 'codejar';

import javascript from 'highlight.js/lib/languages/javascript';
import hljs from 'highlight.js/lib/core';

hljs.registerLanguage('javascript', javascript);

@Component({
  tag: 'inline-editor',
  styleUrl: 'inline-editor.scss',
  // ShadowDOM is not yet supported by CodeJar. Wait for this PR to be merged
  // before re-enabling shadow dom: https://github.com/antonmedv/codejar/pull/47
  // shadow: true,
  // Setting scoped=true breaks highlight.js code highlighting.
  // scoped: true,
})
export class InlineEditor {
  @Prop({ mutable: true }) code: string = '';
  @Event() codeChanged: EventEmitter<string>;

  editor: HTMLElement;
  jar: CodeJar;

  /** This is a hack. I can't get the cursor to behave so I just exposed this. */
  @Method()
  async forceCodeChange(code: string) {
    this.jar?.updateCode((this.code = code));
    // Pretty hacky, but this is the only way to position cursor at end.
    this.jar?.restore({
      start: this.code.length,
      end: this.code.length,
      dir: '->',
    });
    this.editor?.focus();
  }

  componentDidLoad() {
    this.jar = CodeJar(
      this.editor,
      (elem: HTMLElement) => {
        elem.innerHTML = hljs.highlight(elem.textContent, {
          language: 'javascript',
        }).value;
      },
      { tab: '  ' },
    );
    this.jar.onUpdate(code => this.codeChanged.emit(code));
  }

  disconnectedCallback() {
    this.jar.destroy();
  }

  render() {
    return (
      <Host>
        <div class="hljs editor monospace" ref={el => (this.editor = el)}>
          {this.code}
        </div>
      </Host>
    );
  }
}
