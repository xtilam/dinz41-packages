export const dinz41: Dinz41.Extensions = { files: {} } as any;

declare global {
  namespace Dinz41 {
    interface Extensions {
      files: ExtensionsFiles;
    }
    interface ExtensionsFiles {}
  }
}
