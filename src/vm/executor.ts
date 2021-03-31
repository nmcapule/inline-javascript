import { proxy, releaseProxy, wrap } from "comlink";
import Debugger from "./debugger";
import type { API } from "./worker";

function proxyContext(context: any) {
  return proxy(async (command: string[] | string, ...args) => {
    if (typeof command === "string") {
      command = command.split(".");
    }
    let value = command.reduce((parent, prop) => parent[prop], context);
    if (typeof value === "function") {
      value = await value(...args);
    }
    // Non-error throwing approximation of the structured clone algorithm.
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    const s = JSON.stringify(value);
    if (typeof s !== "undefined") return JSON.parse(s);
  });
}

export default class Executor {
  debugger = new Debugger();

  constructor(
    readonly context: Object,
    readonly options?: { mode: "default" | "worker" | "host" }
  ) {
    this.context["debug"] = {
      wait: this.debugger.wait.bind(this.debugger),
      alive: this.debugger.alive.bind(this.debugger),
      disable: ((value = true) => {
        this.debugger.enabled = !value;
      }).bind(this.debugger),
    };
  }

  resume = this.debugger.resume.bind(this.debugger);
  panic = this.debugger.panic.bind(this.debugger);
  destroy = this.debugger.destroy.bind(this.debugger);

  async executeAsWorker(code: string) {
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    const proxyAPI = wrap<any>(worker);
    const api: API = await new (proxyAPI as any)();

    const output = await api.execute(code, proxyContext(this.context));

    worker.terminate();

    return output;
  }

  async executeAsWindow(code: string) {
    let output;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const iframeWindow =
      this.options?.mode === "host" ? window : iframe.contentWindow;
    const createFunction = (iframeWindow as any).Function;

    iframeWindow["context"] = proxyContext(this.context);

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
