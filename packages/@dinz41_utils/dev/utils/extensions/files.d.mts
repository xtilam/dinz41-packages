declare global {
  namespace MyUtils {
    interface Extensions {
      files: ExtensionsFiles;
    }
    interface ExtensionsFiles {
      readJSON<T = any>(path: string): Promise<T>;
      writeJSON(path: string, data: any, checkDir?: boolean): Promise<void>;
    }
  }
}

export {};
