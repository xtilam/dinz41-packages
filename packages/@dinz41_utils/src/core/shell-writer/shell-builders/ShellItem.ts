import ShellOS, { ShellLanguage } from "../ShellOS.js";
import ShellBuildContext from "./ShellBuildContext.js";

const noAppend = function () {};
export default class ShellItem {
  get os() {
    return ShellOS.getInstance();
  }
  bat() {
    return this.#checkShellLanguage("bat");
  }
  sh() {
    return this.#checkShellLanguage("sh");
  }
  #checkShellLanguage(lang: ShellLanguage) {
    if (this.os.scriptLanguage !== lang) {
      this.append = noAppend;
    } else if (this.append === noAppend) {
      delete this.append;
    }
    return this;
  }
  append(ctx: ShellBuildContext) {}
}
