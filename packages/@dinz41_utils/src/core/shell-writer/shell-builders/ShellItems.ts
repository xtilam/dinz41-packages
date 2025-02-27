import ShellBuildContext from "./ShellBuildContext.js";
import ShellItem from "./ShellItem.js";

export default class ShellItems extends ShellItem {
  items: ShellItem[];
  bat() {
    return this;
  }
  sh() {
    return this;
  }
  append(ctx: ShellBuildContext): void {
    this.items.forEach((item) => item.append(ctx));
  }
}
