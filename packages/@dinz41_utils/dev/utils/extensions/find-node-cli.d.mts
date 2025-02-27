declare global {
  namespace MyUtils {
    interface Extensions {
      findNodeCli(moduleName: string, bin?: string): Promise<string>;
    }
  }
}

export {};
