import fs from "fs/promises";
import "../plugins/safe-promise.js";
import { dinz41 } from "../main.js";
import path from "path";

/**
 * Read a JSON file.
 * If the file does not exist or there is a parse error, return null.
 * @param filePath
 * @returns
 */
const readJSON = async <T>(filePath: string) => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as any as T;
  } catch (error) {
    return null;
  }
};

/**
 * Write a JSON file.
 * If the parent directory does not exist, create it.
 * If the path is not a directory, throw an error.
 * @param shouldCheckDirectory check if the parent directory exists (default: true)
 */
const writeJSON = async (
  filePath: string,
  data: any,
  shouldCheckDirectory = true,
  beautify = false
) => {
  if (shouldCheckDirectory) {
    const dir = path.dirname(filePath);
    const [stat] = await fs.stat(dir).safe();
    const initDir = () => fs.mkdir(dir, { recursive: true });
    if (!stat) await initDir();
    if (!stat.isDirectory())
      throw new Error(`Parent path is not a directory: ${dir}`);
  }
  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, beautify ? "\t" : ""),
    "utf-8"
  );
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
