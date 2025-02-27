export const dinz41 = {
  files: {},
  nodeModules: {},
  process: {},
  
} as Dinz41.Extensions;

declare global {
  namespace Dinz41 {
    interface Extensions {
      files: ExtensionsFiles;
      nodeModules: ExtensionsNodeModules;
      process: ExtensionsChildProcess;
    }
    interface ExtensionsFiles {}
    interface ExtensionsNodeModules {}
    interface ExtensionsChildProcess {}
  }
}
