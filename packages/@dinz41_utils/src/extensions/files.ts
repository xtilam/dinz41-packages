import fs from "fs/promises";
import "../plugins/safe-promise.js";
import { dinz41 } from "../main.js";
import path from "path";

const readJSON = async <T>(filePath: string) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as any as T;
  } catch (error) {
    return null;
  }
};

/**
 * @param shouldCheckDirectory check if the parent directory exists (default: true)
 */
const writeJSON = async (
  filePath: string,
  data: any,
  shouldCheckDirectory = true
) => {
  if (shouldCheckDirectory) {
    const dir = path.dirname(filePath);
    const [stat] = await fs.stat(dir).safe();
    const initDir = () => fs.mkdir(dir, { recursive: true });
    if (!stat) await initDir();
    if (!stat.isDirectory())
      throw new Error(`Parent path is not a directory: ${dir}`);
  }
  await fs.writeFile(filePath, data, "utf-8");
};
// ----------------------------------------------
Object.assign(dinz41.files, { readJSON, writeJSON });
// ----------------------------------------------
declare global {
  namespace Dinz41 {
    interface ExtensionsFiles {
      readJSON: typeof readJSON;
      writeJSON: typeof writeJSON;
    }
  }
}
