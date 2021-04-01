import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'inline-render-logs',
  styleUrl: 'inline-render-logs.scss',
  // shadow: true,
  // scoped: true,
})
export class InlineRenderLogs {
  @Prop() logs: { level: string; message: string }[] = [];

  render() {
    return (
      <Host>
        <div class="logger monospace">
          {this.logs.map(log => (
            <div class="log">{log.message.replaceAll('\\n', '\n').replaceAll('\\', '')}</div>
          ))}
          {/* {#each logs as log}
          <div
            class="log"
            class:trace={log.level === "TRACE"}
            class:info={log.level === "INFO"}
            class:warn={log.level === "WARN"}
            class:error={log.level === "ERROR"}
          >
            {log.message.replaceAll("\\n", "\n").replaceAll("\\", "")}
          </div>
        {/each} */}
        </div>
      </Host>
    );
  }
}
