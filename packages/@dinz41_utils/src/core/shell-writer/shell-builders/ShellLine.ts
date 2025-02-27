import ShellBuildContext from "./ShellBuildContext.js";
import ShellItem from "./ShellItem.js";

export default class ShellLine extends ShellItem {
  line = [];
  join = "";
  constructor(line: string | string[] = [], join = "") {
    super();
    this.line = Array.isArray(line) ? line : [line];
    this.join = join;
  }
  space() {
    this.join = " ";
    return this;
  }
  append(ctx: ShellBuildContext): void {
    ctx.add(this.line.join(this.join));
  }
}
