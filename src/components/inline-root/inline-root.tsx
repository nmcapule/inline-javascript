import { Component, h, Host, Listen, State } from '@stencil/core';
import Executor from '../../vm/executor';
import Logger from '../../vm/logger';

import { compressToEncodedURIComponent as compress, decompressFromEncodedURIComponent as decompress } from 'lz-string';
import { InlineEditor } from '../inline-editor/inline-editor';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  tag: 'inline-root',
  styleUrl: 'inline-root.scss',
  // shadow: true,
  scoped: true,
})
export class InlineRoot {
  @State() code: string = `await $(console.log("asd"));
  await $(console.clear());
  
  function derpie(q) { a(); b(); c(); }
  await $(console.log(derpie.toString()))`;
  @State() logs: any[] = [];

  private codeChanged = new Subject<string>();
  private editor: Partial<InlineEditor>;

  vm: Executor;
  logger: Logger;

  async componentWillLoad() {
    const query = new URLSearchParams(window.location.search);
    if (query.get('snippet')) {
      this.code = decompress(query.get('snippet'));
    } else if (query.get('url')) {
      this.code = await fetch(query.get('url')).then(async res => await res.text());
    }
    await customElements.whenDefined('inline-editor');
    await this.editor?.forceCodeChange(this.code);

    this.codeChanged.pipe(debounceTime(1000)).subscribe(code => {
      if (history.pushState) {
        const encoded = compress(code);
        const url = `${window.location.origin}${window.location.pathname}?snippet=${encoded}`;
        window.history.pushState({ path: url }, '', url);
      }
    });
  }

  @Listen('codeChanged')
  async handleCodeChanged(event: CustomEvent<string>) {
    this.code = event.detail;
    this.codeChanged.next(event.detail);
  }

  @Listen('keydown', { target: 'document', capture: true })
  async handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.execute(this.code);
      return event.preventDefault();
    }
    if (event.ctrlKey && event.key === 'q') {
      this.panic();
      return event.preventDefault();
    }
  }

  private async execute(code: string) {
    this.logger = new Logger(v => (this.logs = v));
    this.logger.info('📝 executing JS: ', new Date());

    this.vm = new Executor({ console: this.logger }, { mode: 'worker' });
    try {
      const result = await this.vm.execute(code);
      this.logger.info('📦 return value: ', result);
    } catch (err) {
      this.logger.error('💀 error 💀:', err.stack);
    } finally {
      this.vm?.destroy();
      this.vm = null;
    }
  }

  private async panic() {
    this.vm?.destroy();
  }

  render() {
    return (
      <Host>
        <inline-editor class="block" code={this.code} ref={editor => (this.editor = editor)} />
        <inline-render-logs class="block" logs={this.logs} />
      </Host>
    );
  }
}
