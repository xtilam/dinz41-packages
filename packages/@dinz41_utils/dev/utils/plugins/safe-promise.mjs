(function () {
  Promise.prototype.safe = function () {
    return this.then(
      (value) => new PromiseError(value, undefined),
      (error) =>
        new PromiseError(undefined, error || new Error("Promise error"))
    );
  };
  Promise.safe = function (promise) {
    if (promise instanceof Promise) return promise.safe();
    return promise;
  };
  Promise.prototype.then;
  Promise.safeAll = function (values) {
    return Promise.all(values.map(Promise.safe));
  };
  // ----------------------------------------------
  class PromiseError extends Array {
    constructor(value, error) {
      // @ts-ignore
      super(value, error);
    }
    get value() {
      return this[0];
    }
    get error() {
      return this[1];
    }
    get isDone() {
      return !this[1];
    }
    get isFailed() {
      return !!this[1];
    }
  }
})();
