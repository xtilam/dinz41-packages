import fs from "fs/promises";
import path from "path";
import ShellBuildContext from "./shell-builders/ShellBuildContext.js";
import shellBuilder from "./shell-builders/ShellBuilder.js";
import ShellItem from "./shell-builders/ShellItem.js";
import ShellOS from "./ShellOS.js";

export default class ShellFile {
  items: ShellItem[] = [];
  fileName: string;
  fileDir: string;

  add(...items: ShellItem[]) {
    this.items.push(...items);
    return this;
  }
  get shell() {
    return shellBuilder;
  }
  get shellPath() {
    if (!this.fileDir) throw new Error("File directory not set");
    return path.join(this.fileDir, this.shellFile);
  }
  get shellFile() {
    if (!this.fileName) throw new Error("File name not set");
    return this.fileName + ShellOS.getInstance().fileExt;
  }
  setFile(name: string, dir?: string) {
    if (dir) this.fileDir = dir;
    if (name) this.fileName = name;
    return this;
  }
  async write() {
    const { shellPath } = this;
    await fs.writeFile(shellPath, this.getContent(), "utf-8");
  }
  getContent() {
    const os = ShellOS.getInstance();
    const ctx = new ShellBuildContext();
    os.header.append(ctx);
    this.items.forEach((item) => item.append(ctx));
    os.footer.append(ctx);
    return ctx.list.join("\n");
  }
}
