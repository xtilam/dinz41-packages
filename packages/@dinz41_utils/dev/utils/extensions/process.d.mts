import { ChildProcess } from "child_process";

declare global {
  namespace MyUtils {
    interface Extensions {
      process: ExtensionsProcess;
    }
    interface ExtensionsProcess {
      wait(process: ChildProcess): Promise<number>;
    }
  }
}

export {};
