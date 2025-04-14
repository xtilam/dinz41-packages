import { register } from "module";
import path from "path";
import { pathToFileURL } from "url";
import { picocolors } from "./libs/pc.cjs";
import { WebSocket } from "./libs/ws.cjs";

async function main() {
  preventExit();
  const httpHookURL = pathToFileURL(
    path.join(import.meta.dirname, "./http-hook.mjs")
  );
  register(httpHookURL.href);
  const { __VITE_MAIN_SCRIPT__, __VITE_URL__ } = process.env;
  globalThis.__VITE_CONTEXT__ = {
    WebSocket: class extends WebSocket {
      constructor(...args: ConstructorParameters<typeof WebSocket>) {
        super(...args);
        this.on("message", (data) => {
          try {
            const { type } = JSON.parse(data.toLocaleString());
            console.log(type);
            if (type === "full-reload") {
              // console.log(picocolors.blue("Restarting..."));
              process.exit(0);
            }
          } catch (error) {}
        });
      }
    },
    console: {
      ...console,
      debug(...args) {
        console.log(picocolors.blue(args.join(" ")));
      },
    },
    url: new URL(__VITE_URL__).href,
  };
  Object.assign(globalThis, {
    window: globalThis,
  });
  const moduleURL = (module: string) =>
    pathToFileURL(path.join(path.resolve("."), module)).href;
  import(moduleURL("/@vite/client") as any);
  import(moduleURL(__VITE_MAIN_SCRIPT__));
  // ----------------------------------------------
  function preventExit() {
    process.on("uncaughtException", console.error.bind(0, `[ERROR]`));
    setInterval(() => {}, 2 ** 30);
  }
}

if (DEBUG) {
  if (!globalThis.__VITE_DEV__) main();
  else console.log("[WATCH]", import.meta.dirname);
} else {
  main();
}
