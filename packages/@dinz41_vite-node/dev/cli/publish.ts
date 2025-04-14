import { spawn } from "child_process";
import { Command } from "commander";
import path from "path";
import { __DIRS } from "../common/path-defines";
import { versionPrefix } from "../common/version";
import { utils } from "../utils/utils";

async function publish() {
  const command = new Command()
    .option("-t,--tag", "--tag <tag>", "beta")
    .option("-h,--help", "Display help text");
  const opts = command.parse(process.argv).opts();
  const { readJSON, writeJSON } = utils.files;
  if (opts.help) return command.help();
  const pkgJSONPath = path.join(__DIRS.project, "package.json");
  const versionPublishPath = path.join(__DIRS.dev, "data/version.json");
  const pkgJSON = await readJSON<any>(pkgJSONPath);
  const versionData = await readJSON<any>(versionPublishPath);
  ++versionData[opts.tag];

  const newVersion = `${versionPrefix}${versionData[opts.tag]}-${opts.tag}`;
  if (pkgJSON.version !== newVersion) {
    pkgJSON.version = newVersion;
    await utils.files.writeJSON(pkgJSONPath, pkgJSON);
    console.log("Update package.json version to", newVersion);
  }
  await import("./build.js");
  console.log("Publish version", newVersion);
  const task = spawn("npm", ["publish", "--access=public"], {
    shell: true,
    stdio: "inherit",
  });
  await utils.process.wait(task);
  if (task.exitCode !== 0) return console.error("Publish failed");
  console.log("Publish Done");
  await writeJSON(versionPublishPath, versionData, true);
  console.log("Update version.json", newVersion);
}

await publish();
