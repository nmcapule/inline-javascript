import { execute, signal, init, cleanup, panic, resume } from './executor.worker';

function runOnMainFactory(context: any) {
  return async (callId: number, fn: Function | string, args: any[] = []) =>
    context.signal(
      callId,
      await Function(`return (
        ${fn.toString()}
      )(...arguments)`).apply(context, args),
    );
}

export default class Executor {
  running = false;

  constructor(readonly context: Object) {}

  destroy() {
    cleanup();
  }

  panic() {
    panic();
  }

  resume() {
    resume();
  }

  async execute(code: string) {
    this.running = true;

    let result: any;
    try {
      await init();
      result = await execute(
        code,
        runOnMainFactory({
          ...this.context,
          signal: signal,
        }),
      );
    } finally {
      await cleanup();
    }

    this.running = false;

    return result;
  }
}
