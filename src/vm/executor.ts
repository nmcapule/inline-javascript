import { Subject } from "rxjs";
import { first } from "rxjs/operators";

export default class Executor {
  breaker = new Subject();

  constructor(readonly context: Object) {
    context["debug"] = {
      enabled: true,
      sleep: (ms) =>
        context["debug"].enabled && new Promise((ok) => setTimeout(ok, ms)),
      break: (preamble) =>
        context["debug"].enabled &&
        (preamble() || 1) &&
        new Promise((resolve, reject) =>
          this.breaker.pipe(first()).subscribe(resolve, reject)
        ),
    };
  }

  resume() {
    this.breaker.next();
  }

  destroy() {
    this.breaker.complete();
  }

  async execute(code: string) {
    let output;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const createFunction = (iframeWindow as any).Function;

    Object.entries(this.context).forEach(
      ([key, value]) => (iframeWindow[key] = value)
    );

    const fn = createFunction(`return (async () => {${code}})()`);
    output = await fn();

    document.body.removeChild(iframe);
    return output;
  }
}
