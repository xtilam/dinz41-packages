import { ChildProcess } from "child_process";
import { dinz41 } from "../main.js";

/**
 * Wait for a child process to exit.
 * If the process is already exited, return the exit code.
 * @param process
 * @returns
 */
function wait(process: ChildProcess) {
  return new Promise((resolve) => {
    if (!process) return resolve(0);
    if (process.killed || process.exitCode !== null)
      return resolve(process.exitCode);
    process.on("error", () => resolve(0));
    process.on("exit", (code) => resolve(code));
  });
}
// ----------------------------------------------
Object.assign(dinz41.process, { wait });
// ----------------------------------------------
declare global {
  namespace Dinz41 {
    interface ExtensionsChildProcess {
      wait: typeof wait;
    }
  }
}
