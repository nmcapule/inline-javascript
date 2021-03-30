import Debugger from "./debugger";

export default class Executor {
  debugger = new Debugger();

  constructor(readonly context: Object) {}

  resume = this.debugger.resume.bind(this.debugger);
  panic = this.debugger.panic.bind(this.debugger);
  destroy = this.debugger.destroy.bind(this.debugger);

  async execute(code: string) {
    let output;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const createFunction = (iframeWindow as any).Function;

    this.context["debug"] = {
      wait: this.debugger.wait.bind(this.debugger),
    };
    Object.entries(this.context).forEach(
      ([key, value]) => (iframeWindow[key] = value)
    );

    const fn = createFunction(`return (async () => {${code}})()`);
    output = await fn();

    document.body.removeChild(iframe);
    return output;
  }
}
