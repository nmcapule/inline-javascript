import { timer, Observable, race, Subject } from "rxjs";
import { first, tap } from "rxjs/operators";

export default class Executor {
  breaker = new Subject();
  panicker = new Subject();

  constructor(readonly context: Object) {
    context["debug"] = {
      enabled: true,
      wait: async (
        options?:
          | {
              ms?: number;
              preamble?: Function;
              callback?: Function;
            }
          | number
          | Function
      ) => {
        if (!context["debug"].enabled) {
          return;
        } else if (typeof options === "number") {
          options = { ms: options };
        } else if (typeof options === "function") {
          options = { preamble: options };
        } else if (typeof options === "undefined") {
          options = {};
        }

        if (typeof options.preamble === "function") options.preamble();

        const observables: Observable<any>[] = [
          this.breaker,
          this.panicker.pipe(
            tap(() => {
              throw new Error("VM panicked!");
            })
          ),
        ];
        if (
          !Number.isNaN(options.ms) &&
          typeof options.ms !== "undefined" &&
          options.ms !== null
        ) {
          observables.push(timer(options.ms));
        }

        await race(observables).pipe(first()).toPromise();

        if (typeof options.callback === "function") options.callback();
      },
    };
  }

  resume() {
    this.breaker.next();
  }

  panic() {
    this.panicker.next();
    this.destroy();
  }

  destroy() {
    this.breaker.complete();
    this.panicker.complete();
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
