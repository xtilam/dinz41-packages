function wrapResult(result) {
  return new ExceptionResult(result, undefined);
}
function wrapError(err) {
  return new ExceptionResult(
    undefined,
    err instanceof BaseError ? err : new ExecuteError(err)
  );
}

export const catchException: ExceptionHandler = ((callback) => {
  try {
    const result = callback();
    if (result instanceof Promise) {
      return result
        .then((res) => wrapResult(res))
        .catch((err) => wrapError(err));
    }
    return wrapResult(result);
  } catch (err) {
    return wrapError(err);
  }
}) as any as ExceptionHandler;

class ExceptionResult<T, E> extends Array implements IExceptionResult<T, E> {
  constructor(value: T, error: E) {
    super(2);
    this[0] = value;
    this[1] = error;
  }
  get value(): T {
    return this[0];
  }
  get error(): E {
    return this[1];
  }
  throw() {
    if (this[1]) throw this[1];
  }
}

export class BaseError<N> extends Error {
  declare type: N;
  static init<T extends new (...args: any) => BaseError<any>>(
    this: T,
    type: InstanceType<T>["type"]
  ) {
    this.prototype.type = type;
    return this as T;
  }
  get message() {
    return this.type as string;
  }
  set(data: Partial<typeof this>) {
    Object.assign(this, data);
    return this;
  }
}

class ExecuteError extends BaseError<"ExecuteError"> {
  cause: Error;
  constructor(cause: Error) {
    super();
    this.cause = cause;
  }
  get message() {
    return this.type + `${this.cause?.message || `${this.cause}`}`;
  }
}

// ----------------------------------------------
export type ExtendsErrors<T, E = never> = Exclude<
  T extends (...args: any[]) => infer R ? UnWrapExceptions<R> : ExecuteError,
  E
>;

type UnWrapExceptions<T> = T extends ExceptionResultWrapper<unknown, infer E>
  ? E
  : T extends Promise<any>
  ? UnWrapExceptions<Awaited<T>>
  : ExecuteError;

type ExceptionHandler = <D extends BaseError<any>, T = any>(
  callback: () => T | Promise<T>,
  errors?: D
) => T extends Promise<any>
  ? Promise<ExceptionResultWrapper<Awaited<T>, D>>
  : ExceptionResultWrapper<T, D>;

interface IExceptionResult<T, E> {
  get value(): T;
  get error(): E;
  throw(): void;
}
type ExceptionResultWrapper<T, E extends BaseError<any>> = IExceptionResult<
  T,
  E | ExecuteError
> &
  [result: T, error: E | ExecuteError];
