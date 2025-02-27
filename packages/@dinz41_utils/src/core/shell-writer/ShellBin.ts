import ShellFile from "./ShellFile.js";
import fs from "fs/promises";
import "../../plugins/safe-promise.js";

export default class ShellBin {
  binDir = "";
  files: Map<string, ShellFile> = new Map();
  addShell(name: string) {
    const file = new ShellFile();
    file.setFile(name);
    this.files.set(name, file);
    return file;
  }
  async write() {
    const entries = Array.from(this.files.entries());
    const validFiles = new Set();
    const isCreated = await this.#initBinDir();
    await Promise.all(
      entries.map(async ([name, file]) => {
        file.setFile(name, this.binDir);
        validFiles.add(file.shellFile);
        await file.write();
        console.log(`File written: ${file.shellFile}`);
      })
    );
    if (!isCreated) return;
    const invalidFiles = (await fs.readdir(this.binDir)).filter((file) => {
      if (validFiles.has(file)) return false;
      validFiles.delete(file);
      return true;
    });
    await Promise.all(
      invalidFiles.map(async (file) => {
        await fs.rm(file, { recursive: true });
        console.log(`File removed: ${file}`);
      })
    );
  }
  async #initBinDir() {
    if (!this.binDir) throw new Error("Bin directory not set");
    const init = () =>
      fs.mkdir(this.binDir, { recursive: true }).then(() => true);
    const [stat] = await fs.stat(this.binDir).safe();
    if (!stat) return await init();
    if (stat.isDirectory()) return false;
    await fs.rm(this.binDir, { recursive: true });
    return await init();
  }
}
