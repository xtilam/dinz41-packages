import md5Fn from "md5";
import md5File from "md5-file";
import { dinz41 } from "../main.js";
import "../plugins/safe-promise.js";
import fs from "fs/promises";
import path from "path";

const md5 = md5Fn as any as (data: string) => string;

class MD5File {
  filePath: string;
  constructor(filePath: string) {
    this.filePath = filePath;
  }
  /**
   * @returns  MD5 hash of the file
   */
  async getMD5() {
    const [stat] = await fs.stat(this.filePath).safe();
    if (!stat) return "";
    if (!stat.isFile()) throw new Error(`Path is not a file: ${this.filePath}`);
    return await md5File(this.filePath);
  }
  /**
   * @returns true if the directory is created
   */
  async initDir() {
    const dir = path.dirname(this.filePath);
    const [stat] = await fs.stat(dir).safe();
    if (!stat) {
      await fs.mkdir(dir, { recursive: true });
      return true;
    } else if (!stat.isDirectory()) {
      throw new Error(`Parent path is not a directory: ${dir}`);
    }
    return false;
  }
  /**
   *
   * @param data JSON data
   * @param beautify beautify the JSON output
   * @returns true if the file is created or the content is different
   */
  writeJSON(data: any, beautify = true) {
    const args: any = [data];
    if (beautify) args.push(null, "\t");
    return this.write(JSON.stringify.apply(0, args));
  }
  /**
   * @returns true if the file is created or the content is different
   */
  async write(content: string) {
    const isCreated = await this.initDir();
    const isSameContent = !isCreated && (await this.getMD5()) === md5(content);
    if (isSameContent) return false;
    await fs.writeFile(this.filePath, content, "utf-8");
    return true;
  }
}
// ----------------------------------------------
Object.assign(dinz41.files, { MD5File, md5 });
// ----------------------------------------------
declare global {
  namespace Dinz41 {
    interface Extensions {
      md5: typeof md5;
    }
    interface ExtensionsFiles {
      MD5File: typeof MD5File;
    }
  }
}
