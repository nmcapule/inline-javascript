import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'inline-render-logs',
  styleUrl: 'inline-render-logs.scss',
  // shadow: true,
  // scoped: true,
})
export class InlineRenderLogs {
  @Prop() logs: { level: string; message: string }[] = [];

  logger: HTMLElement;

  render() {
    return (
      <Host>
        <div class="logger monospace" ref={ref => (this.logger = ref)}>
          {!this.logs.length && (
            <marquee scrollamount="1">
              <div class="log">🐢🎈</div>
            </marquee>
          )}
          {this.logs.map(log => (
            <div
              class={{
                log: true,
                trace: log.level === 'TRACE',
                info: log.level === 'INFO',
                warn: log.level === 'WARN',
                error: log.level === 'ERROR',
              }}
            >
              {log.message.replaceAll('\\n', '\n').replaceAll('\\', '')}
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
