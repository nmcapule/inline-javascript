import { Subject } from 'rxjs';
import { filter, first, map, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

const STATE_PROP = 'state';
const DEFINE_ON_MAIN = 'defui';

self[STATE_PROP] = new Subject<[string, any]>();
let unsubscribe = new Subject();

export async function initWorker() {
  self[STATE_PROP] = new Subject<[string, any]>();
  unsubscribe = new Subject();
}

export async function execute(code: string, runOnMain: (...args) => any) {
  self[DEFINE_ON_MAIN] = fn => async (...args) => {
    const callId = uuidv4();
    runOnMain(callId, fn.toString(), args);
    return await self[STATE_PROP].pipe(
      filter(([key, _value]) => key === callId),
      map(([_key, value]) => value),
      first(),
      takeUntil(unsubscribe),
    ).toPromise();
  };

  const fn = self.Function(`return (async () => {
    ${code};
  })();`);

  return await fn();
}

export async function setWorkerState(key, value) {
  self[STATE_PROP].next([key, value]);
}

export async function cleanupWorker() {
  unsubscribe.next();
  unsubscribe.complete();
}
