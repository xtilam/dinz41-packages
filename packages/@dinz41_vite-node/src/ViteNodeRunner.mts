import { wait } from "@dinz41/utils/extensions/child-process";
import { fork } from "child_process";
import path from "path";
import picocolors from "picocolors";
import readline from "readline";

if (DEBUG) {
  globalThis.__VITE_DEV__ = true;
  //@ts-ignore
  //@ts-nocheck
  import("./vite-node-runner.mjs");
  //@ts-ignore
  //@ts-nocheck
  import("./http-hook.mjs");
}

export class ViteNode {
  port: number;
  script: string;

  constructor(port: number, script: string) {
    this.port = port;
    this.script = script;
  }
  private _getProjectDir() {
    return path.resolve(".");
  }
  private get baseURL() {
    return new URL(`http://localhost:${this.port}/`);
  }
  private get _env() {
    return {
      __VITE_URL__: this.baseURL.href,
      __VITE_MAIN_SCRIPT__: this.script,
    } as Partial<NodeJS.ProcessEnv>;
  }

  async runProc() {
    let abortController: AbortController;
    const run = async () => {
      abortController = new AbortController();
      const progress = fork(runScript, process.argv.slice(2), {
        stdio: "inherit",
        execArgv: ["--enable-source-maps"],
        cwd: this._getProjectDir(),
        env: this._env,
        signal: abortController.signal,
      });
      await wait(progress);
      run();
    };

    const watchHotkey = () => {
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.on("keypress", (_, key) => {
        if (!key.ctrl) return;
        if (key.name === "r") {
          console.log(picocolors.blue("[Restarting...]"));
          return abortController.abort();
        }
        if (key.sequence === "\u0003") {
          console.log(picocolors.red("[Exiting...]"));
          process.stdin.setRawMode(false);
          process.exit();
        }
      });
    };
    // ----------------------------------------------
    const runScript = path.join(import.meta.dirname, "./vite-node-runner.mjs");
    run();
    watchHotkey();
  }
}
