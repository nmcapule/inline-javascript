import { Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import Debugger from './debugger';

const DEFINE_SIGNAL = 'signal';
const DEFINE_ON_MAIN = 'defui';
const DEFINE_DEBUG = 'debug';

self[DEFINE_SIGNAL] = new Subject<[string, any]>();
let unsubscribe = new Subject();

export async function init() {
  self[DEFINE_SIGNAL] = new Subject<[string, any]>();
  unsubscribe = new Subject();
}

export async function execute(code: string, runOnMain: (...args) => any) {
  self[DEFINE_ON_MAIN] = fn => async (...args) => {
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
  self[DEFINE_DEBUG] = new Debugger();

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
