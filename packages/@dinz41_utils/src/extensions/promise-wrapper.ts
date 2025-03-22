import { dinz41 } from "../main.js";

function wrapper<T = any, E = any>() {
  return new ImplPromiseWrapper<T, E>() as any as PromiseWrapper<T, E>;
}

Object.assign(dinz41.promise, { wrapper });
// ----------------------------------------------
class ImplPromiseWrapper<T = any, E = any>
  extends Array
  implements IPromiseWrapper<T, E>
{
  constructor() {
    super(3);
    this[0] = new Promise<T>((resolve, reject) => {
      this[1] = resolve;
      this[2] = reject;
    });
  }
  get promise(): Promise<T> {
    return this[0];
  }
  get resolve(): (value: T | PromiseLike<T>) => void {
    return this[1];
  }
  get reject(): (reason?: any) => void {
    return this[2];
  }
}
// ----------------------------------------------
declare global {
  namespace Dinz41 {
    interface ExtensionsPromise {
      wrapper: typeof wrapper;
    }
  }
}
// ----------------------------------------------
interface IPromiseWrapper<T, E = any> {
  get promise(): Promise<T>;
  get resolve(): (resolve?: T) => void;
  get reject(): (reason?: E) => void;
}

export type PromiseWrapper<T, E = any> = IPromiseWrapper<T, E> &
  [
    Promise<T>,
    IPromiseWrapper<T, E>["resolve"],
    IPromiseWrapper<T, E>["reject"]
  ];
