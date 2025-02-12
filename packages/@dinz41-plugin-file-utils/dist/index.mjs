import fs from "fs/promises";
import "@dinz41/safe-promise";
import dinz41 from "@dinz41/defines";
import md5 from "md5";
import md5File from "md5-file";
import { dirname } from "path";

const defaultWriteFileOptions = { checkMD5: true, checkDir: true };
const file = dinz41.utils.file || (dinz41.utils.file = {});

file.readJSON = async function (filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch {
    return null;
  }
};

file.writeJSON = function (
  filePath = "",
  data = {},
  options = defaultWriteFileOptions
) {
  return new Promise((resolve, reject) => {
    try {
      return writeFile(filePath, JSON.stringify(data, null, "\t"), options)
        .then(resolve)
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

file.write = async function (
  filePath,
  content,
  options = defaultWriteFileOptions
) {
  const { checkDir, checkMD5 } = options || {};
  await initDir();
  if (checkMD5 && (await isSameMD5())) return false;
  return Boolean(
    !(await fs.writeFile(filePath, content, "utf-8").safe()).error
  );
  // ----------------------------------------------
  async function isSameMD5() {
    const [stat] = await fs.stat(filePath).safe();
    if (!stat) return false;
    if (!stat.isFile()) return false;
    const oldMD5 = await md5File(filePath);
    const newMD5 = md5(content);
    return oldMD5 === newMD5;
  }
  async function initDir() {
    if (!checkDir) return;
    const baseDir = dirname(filePath);
    const [stat] = await fs.stat(baseDir).safe();
    if (!stat) await fs.mkdir(baseDir, { recursive: true });
  }
};
