export default class Logger {
  logs = [];

  constructor(readonly logCallback?: Function) {}

  logWithLevel(level: string, ...args) {
    const message = args.map(arg => (JSON.stringify(arg) || '').replace(/^"(.+)"$/g, '$1')).join(' ');
    this.logs = [...this.logs, { level, message }];

    if (this.logCallback) this.logCallback(this.logs);
  }

  trace = (...args) => this.logWithLevel('TRACE', ...args);
  log = (...args) => this.logWithLevel('INFO', ...args);
  info = (...args) => this.logWithLevel('INFO', ...args);
  warn = (...args) => this.logWithLevel('WARN', ...args);
  error = (...args) => this.logWithLevel('ERROR', ...args);
  clear = () => {
    this.logs = [];
    if (this.logCallback) this.logCallback(this.logs);
  };
}
