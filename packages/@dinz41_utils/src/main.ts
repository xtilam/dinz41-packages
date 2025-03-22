export const dinz41 = {
  files: {},
  nodeModules: {},
  process: {},
  promise: {},
  debounce: {},
} as Dinz41.Extensions;

declare global {
  namespace Dinz41 {
    interface Extensions {
      files: ExtensionsFiles;
      nodeModules: ExtensionsNodeModules;
      process: ExtensionsChildProcess;
      promise: ExtensionsPromise;
      debounce: ExtensionDebounce;
    }
    interface ExtensionsPromise { }
    interface ExtensionsFiles { }
    interface ExtensionsNodeModules { }
    interface ExtensionDebounce { }
    interface ExtensionsChildProcess { }
  }
}
