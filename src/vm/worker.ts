import { expose } from "comlink";

export class API {
  async execute(code: string, context = {}) {
    Object.entries(context).forEach(([key, value]) => (self[key] = value));
    const fn = self.Function(`\
    return (async () => {${code}})();
    `);
    return await fn();
  }

  add(a, b) {
    self.Function(`console.log("ola")`)();
    return a + b;
  }
}

expose(API);
