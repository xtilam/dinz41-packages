import fs from "fs/promises";
import path from "path";
import u from "../utils-defines.mjs";

(function () {
  const f = u.files;
  f.readJSON = async function (filePath) {
    try {
      return JSON.parse(await fs.readFile(filePath, "utf-8"));
    } catch (error) {
      return null;
    }
  };
  f.writeJSON = async function (filePath, data, checkDir = true) {
    if (checkDir) {
      const dir = path.dirname(filePath);
      let [stat] = await fs.stat(dir).safe();
      if (stat) {
        if (!stat.isDirectory()) {
          await fs.rm(stat, { recursive: true });
          stat = null; 
        }
      }
      if (!stat) await fs.mkdir(dir, { recursive: true });
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  };
})();
