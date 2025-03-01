import { utils } from "../utils/utils";
import { spawn } from "child_process";

async function main() {
  await import("./build");
  const publishTask = spawn("npm", ["publish", "--access=public"], {
    shell: true,
    stdio: "inherit",
  });
  await utils.process.wait(publishTask);
}

main();
