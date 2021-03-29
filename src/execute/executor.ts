export default class Executor {
  constructor(readonly context: Object) {}

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
