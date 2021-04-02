import { Component, Host, h, Prop, Event, EventEmitter, Watch, Listen } from '@stencil/core';
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
  @Prop() code: string = '';
  @Event() codeChanged: EventEmitter<string>;

  editor: HTMLElement;
  jar: CodeJar;

  @Watch('code')
  handleCodePropChange() {
    if (this.editor?.textContent !== this.code) this.jar?.updateCode(this.code);
  }

  componentDidLoad() {
    this.jar = CodeJar(
      this.editor,
      (elem: HTMLElement) => {
        elem.textContent = elem.textContent;
        hljs.highlightElement(elem, {
          language: 'javascript',
        });
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
