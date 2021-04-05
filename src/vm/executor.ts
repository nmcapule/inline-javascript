import { execute, setWorkerState, initWorker, cleanupWorker } from './executor.worker';

function runOnMainFactory(context: any) {
  return async (callId: number, fn: Function | string, args: any[] = []) =>
    context.setState(
      callId,
      await Function(`return (
        ${fn.toString()}
      )(...arguments)`).apply(context, args),
    );
}

export default class Executor {
  constructor(readonly context: Object) {}

  destroy() {
    cleanupWorker();
  }

  async execute(code: string) {
    await initWorker();
    const result = await execute(
      code,
      runOnMainFactory({
        ...this.context,
        setState: setWorkerState,
      }),
    );
    await cleanupWorker();

    return result;
  }
}
