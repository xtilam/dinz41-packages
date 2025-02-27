// ----------------------------------------------
declare global {
  interface Promise<T> {
    safe<D = any>(): Promise<SafePromiseResult<T, D>>;
  }

  interface PromiseConstructor {
    safe<T>(promise: Promise<T>): Promise<SafePromiseResult<T>>;
    safeAll<T extends readonly unknown[] = []>(
      values: T
    ): Promise<{
      -readonly [P in keyof T]: SafePromiseResult<Awaited<T[P]>>;
    }>;
  }

  type SafePromiseResult<T, E = any> = readonly [T, E] & {
    readonly value: T;
    readonly error: E;
    readonly isDone: boolean;
    readonly isFailed: boolean;
  };
}

export {};
