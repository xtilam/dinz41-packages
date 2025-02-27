import path from "path";

import { __DIRS } from "./common/dirs-defines.mjs";
import { ShellWriter } from "./utils/libs/ShellWriter.mjs";
import "./utils/plugins/safe-promise.mjs";
import utils from "./utils/utils.mjs";

async function main() {
  const str = JSON.stringify;
  const shellWriter = new ShellWriter();
  const tsxScript = await utils.findNodeCli("tsx", "tsx");
  shellWriter.findOSConfig();

  addCli("build", true);
  addCli("link-test", true);
  addCli("publish", true);
  addTest("shell");
  addTest("play");

  shellWriter.addShellJS(import.meta.filename);
  shellWriter.addShellJS(import.meta.filename, true);
  shellWriter.binDir = __DIRS.bin;

  await shellWriter.writeAll();
  await shellWriter.clearBinDir();
  // ----------------------------------------------
  function addTest(name) {
    const testScriptPath = path.join(__DIRS.curTest, `${name}.ts`);
    shellWriter.addShellFile(`test-${name}`, [
      `node ${str(tsxScript)} --watch ${str(testScriptPath)} ${
        shellWriter.osConfig.passArgs
      }`,
    ]);
  }
  function addCli(name, watch = false) {
    const scriptPath = path.join(__DIRS.dev, "cli", name + ".mjs");
    shellWriter.addShellJS(scriptPath);
    if (watch) shellWriter.addShellJS(scriptPath, watch);
  }
}

main();
