export default class Signal<T> {
  #value: T;
  #setUpdate = new Set<CBSignal<T>>();
  #setObjectUpdate = new Set<Object>();
  #symbol = Symbol("Signal");

  constructor(value: T) {
    this.#value = value;
  }
  change(callback: CBSignal<T, any>) {
    try {
      callback(this.#value);
      this.set(this.#value);
    } catch (error) {}
  }
  assign(callback: CBSignal<T, Partial<T>>) {
    try {
      const assginObj = callback(this.#value);
      if (!assginObj) return;
      const obj = this.#value || {};
      Object.assign(obj, assginObj);
      this.set(obj as any);
    } catch (error) {}
  }
  update(callback: CBSignal<T, T>) {
    try {
      this.set(callback(this.#value));
    } catch (error) {}
  }
  set(value: T) {
    this.#value = value;
    this.#triggerChanged(value);
  }
  get() {
    return this.#value;
  }
  removeCallback(callback: CBSignal<T>) {
    this.#setUpdate.delete(callback);
  }
  removeObject(obj: any, ...callbacks: CBSignal<T>[]) {
    if (!obj) return;
    const set = this.#getSetSignalObject(obj);
    if (!set) return;
    const removeObj = () => {
      this.#setObjectUpdate.delete(obj);
      delete obj[this.#symbol];
    };
    if (!callbacks.length) return removeObj();
    callbacks.forEach((cb) => set.delete(cb));
    if (set.size === 0) removeObj();
  }
  useObject(obj: any, callback: CBSignal<T>) {
    if (!obj) return;
    if (typeof obj !== "object") return;
    const setSignals = this.#initSetSignalObject(obj);
    setSignals.add(callback);
  }
  useCallback(callback: CBSignal<T>) {
    this.#setUpdate.add(callback);
    return () => this.#setUpdate.delete(callback);
  }
  #triggerChanged(val: T) {
    this.#setUpdate.forEach((cb) => cb(val));
    this.#setObjectUpdate.forEach((obj) => {
      const set = this.#getSetSignalObject(obj);
      set.forEach((cb) => cb(val));
    });
  }
  #getSetSignalObject(obj: any): Set<CBSignal<T>> {
    return obj[this.#symbol];
  }
  #initSetSignalObject(obj: any) {
    let set: Set<CBSignal<T>> = this.#getSetSignalObject(obj);
    if (!set) {
      obj[this.#symbol] = set = new Set();
      this.#setObjectUpdate.add(obj);
    }
    return set;
  }
}

type CBSignal<T, R = any> = (value: T) => R;
