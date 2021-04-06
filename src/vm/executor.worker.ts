import { Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import Debugger from './debugger';

const DEFINE_SIGNAL = 'signal';
const DEFINE_ON_MAIN = 'defui';
const DEFINE_DEBUG = 'debug';
const DEFINE_DWITTER = 'dwitter';

self[DEFINE_SIGNAL] = new Subject<[string, any]>();
let unsubscribe = new Subject();

export async function init() {
  self[DEFINE_SIGNAL] = new Subject<[string, any]>();
  unsubscribe = new Subject();
}

function registerDefineOnMain(runOnMain: Function) {
  return fn => async (...args) => {
    const callId = uuidv4();
    await self[DEFINE_DEBUG].wait(0);
    runOnMain(callId, fn.toString(), args);
    return await self[DEFINE_SIGNAL].pipe(
      filter(([key, _value]) => key === callId),
      map(([_key, value]) => value),
      first(),
      takeUntil(unsubscribe),
    ).toPromise();
  };
}

function registerDwitter() {
  return async (fn: Function, limit = 10000) =>
    self[DEFINE_ON_MAIN]((fnstr, limit) => {
      /** WARNING: This block is JS-only and will be run on the UI thread. */

      // Interact with the context of the UI thread.
      this.showCanvas(true);

      // Avoid TS errors since we are in JS-land.
      const me = self as any;
      me.S = Math.sin;
      me.C = Math.cos;
      me.T = Math.tan;
      me.R = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
      me.c = this.canvas;
      me.x = me.c.getContext('2d');
      me.u = new Function(`(${fnstr})(...arguments)`);

      // Clear canvas.
      me.c.width = me.c.width;

      let start = performance.now();
      return new Promise(ok => {
        const step = _timestamp => {
          const elapsed = performance.now() - start;
          me.u(elapsed / 1000);
          if (elapsed < limit) {
            window.requestAnimationFrame(step);
          } else {
            ok(null);
          }
        };
        window.requestAnimationFrame(step);
      });
    })(fn.toString(), limit);
}

export async function execute(code: string, runOnMain: (...args) => any) {
  self[DEFINE_ON_MAIN] = registerDefineOnMain(runOnMain);
  self[DEFINE_DEBUG] = new Debugger();
  self[DEFINE_DWITTER] = registerDwitter();

  const fn = self.Function(`return (async () => {
    ${code};
  })();`);

  return await fn();
}

export async function signal(key, value) {
  self[DEFINE_SIGNAL].next([key, value]);
}

export async function panic() {
  self[DEFINE_DEBUG].panic();
}

export async function resume() {
  self[DEFINE_DEBUG].resume();
}

export async function cleanup() {
  unsubscribe.next();
  unsubscribe.complete();
}
