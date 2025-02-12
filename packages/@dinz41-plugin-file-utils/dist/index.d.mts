type WriteFileOptions = { checkMD5?: boolean; checkDir?: boolean };
type PluginExt = {
  readJSON<T = any>(filePath: string): Promise<T>;
  writeJSON<T = any>(
    filePath: string,
    data: T,
    options?: WriteFileOptions
  ): Promise<boolean>;
  write(
    filePath: string,
    data: any,
    options?: WriteFileOptions
  ): Promise<boolean>;
};

declare module "@dinz41/defines" {
  export interface Dinz41PluginFileUtils extends PluginExt {}
  export interface Dinz41Utils {
    file: Dinz41PluginFileUtils;
  }
}

export {};
