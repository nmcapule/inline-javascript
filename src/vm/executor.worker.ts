function proxify(parent) {
  let proxy: ProxyConstructor;
  const handler = {
    get: (target, prop, _receiver) => {
      target.path = [...(target.path || []), prop];
      if (prop === 'do') {
        const sliced = target.path.slice(0, target.path.length - 1);
        target.path = [];
        return () => target(sliced);
      }
      return proxy;
    },
    apply: (target, thisArg, args) => {
      // If this is undefined, we're calling the func directly.
      if (!thisArg) {
        let result;
        for (const arg of args) {
          if (typeof arg === 'function') {
            result = arg['do']();
          } else {
            result = target(arg);
          }
        }
        return result;
      }
      target.path = [...(target.path || []), [...args]];
      return proxy;
    },
  };
  return (proxy = new Proxy(parent, handler));
}

export async function execute(code: string, context: (...args) => any) {
  self['$'] = proxify(context);
  self['call'] = self['$'];
  self['console'] = proxify(args => context(['console', ...args]));

  const fn = self.Function(`return (async () => {
    ${code};
  })();`);
  return await fn();
}
