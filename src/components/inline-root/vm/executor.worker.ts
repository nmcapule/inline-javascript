export async function execute(code: string, context?: (command, ...args) => Promise<any>) {
  self['context'] = context;
  const fn = self.Function(`return (async () => {${code}})();`);
  return await fn();
}
