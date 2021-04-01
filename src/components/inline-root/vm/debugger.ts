import { Observable, race, Subject, timer } from "rxjs";
import { first, tap } from "rxjs/operators";

export default class Debugger {
  breaker = new Subject();
  panicker = new Subject();
  enabled = true;

  lastThrottle = new Date();

  /**
   * Just like `this.wait(0)` but only triggers every @ms milliseconds so that
   * it will not become a bottleneck. Put in a tight loop to make sure that the
   * UI still breathes.
   */
  async alive(ms = 250) {
    const now = new Date();
    if (now.getTime() - this.lastThrottle.getTime() < ms) {
      return;
    }
    this.lastThrottle = now;
    await this.wait(0);
  }

  async wait(
    options?:
      | {
          ms?: number;
          preamble?: Function;
          callback?: Function;
        }
      | number
      | Function
  ) {
    if (!this.enabled) {
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
  }

  resume() {
    this.breaker?.next();
  }

  panic() {
    this.panicker?.next();
    this.destroy();
  }

  destroy() {
    this.breaker?.complete();
    this.panicker?.complete();
  }
}
