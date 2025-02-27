import { fork } from "child_process";
import esbuild from "esbuild";
import fs from "fs/promises";
import { buildConfigs } from "../common/build-configs.mjs";
import { __DIRS } from "../common/dirs-defines.mjs";
import utils from "../utils/utils.mjs";
import path from "path";

async function main() {
  await clearDist();
  await Promise.all([buildJS(), buildDTS()]);
  console.log("Build completed.");
  // ----------------------------------------------
  async function clearDist() {
    console.log("Clearing dist folder...");
    if ((await fs.stat(__DIRS.dist).safe()).value)
      await fs.rm(__DIRS.dist, { recursive: true });
    console.log("Cleared dist folder.");
  }
  async function buildJS() {
    console.log("Building JS...");
    await esbuild.build({ ...buildConfigs });
    console.log("Built JS.");
  }
  async function buildDTS() {
    console.log("Building DTS...");
    const tscScript = await utils.findNodeCli("typescript", "tsc");
    const tscProgress = fork(tscScript, ["--build"], {
      stdio: "inherit",
      cwd: __DIRS.project,
    });
    await utils.process.wait(tscProgress);
    console.log("Built DTS.");
  }
}

main();
