import { releaseProxy, wrap } from "comlink";
import Debugger from "./debugger";
import type { API } from "./worker";

export default class Executor {
  debugger = new Debugger();

  constructor(
    readonly context: Object,
    readonly options?: { mode: "default" | "worker" | "host" }
  ) {}

  resume = this.debugger.resume.bind(this.debugger);
  panic = this.debugger.panic.bind(this.debugger);
  destroy = this.debugger.destroy.bind(this.debugger);

  async executeAsWorker(code: string) {
    const proxyAPI = wrap(
      new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      })
    );
    const api: API = await new (proxyAPI as any)();

    const output = await api.execute(code /*, this.context */);

    proxyAPI[releaseProxy]();

    return output;
  }

  async executeAsWindow(code: string) {
    this.context["debug"] = {
      wait: this.debugger.wait.bind(this.debugger),
      alive: this.debugger.alive.bind(this.debugger),
      disable: ((value = true) => {
        this.debugger.enabled = !value;
      }).bind(this.debugger),
    };

    let output;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const iframeWindow =
      this.options?.mode === "host" ? window : iframe.contentWindow;
    const createFunction = (iframeWindow as any).Function;
    Object.entries(this.context).forEach(
      ([key, value]) => (iframeWindow[key] = value)
    );

    const fn = createFunction(`return (async () => {${code}})()`);
    output = await fn();

    document.body.removeChild(iframe);

    return output;
  }

  async execute(code: string) {
    switch (this.options?.mode) {
      case "worker":
        return this.executeAsWorker(code);
      case "host":
      default:
        return this.executeAsWindow(code);
    }
  }
}
