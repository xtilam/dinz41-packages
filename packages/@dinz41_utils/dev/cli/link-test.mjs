import { spawn } from "child_process";
import { __DIRS } from "../common/dirs-defines.mjs";
import utils from "../utils/utils.mjs";

async function main() {
  const str = JSON.stringify;
  const progress = spawn("pnpm", ["link", str(__DIRS.project)], {
    cwd: __DIRS.test,
    shell: true,
    stdio: "inherit",
  });
  await utils.process.wait(progress);
}

await main();
