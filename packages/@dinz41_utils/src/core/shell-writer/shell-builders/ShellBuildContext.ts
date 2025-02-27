export default class ShellBuildContext {
  list = [];
  #taxLength = 0;
  #tab = "";

  get tab() {
    return this.#tab;
  }
  add(...lines) {
    let addCount = 0;
    lines.forEach((v) => {
      v && this.list.push(this.#tab + v);
      addCount++;
    });
    return addCount;
  }
  #incTab(inc = 0) {
    this.#taxLength += inc;
    if (this.#taxLength < 0) {
      this.#taxLength = 0;
      this.#tab = "";
      return;
    }
    this.#tab = "".padEnd(this.#taxLength, "\t");
  }
  incTab() {
    this.#incTab(1);
  }
  decTab() {
    this.#incTab(-1);
  }
}
