import esbuild, { BuildOptions, Plugin } from "esbuild";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { __DIRS } from "../common/path-defines";
import { utils } from "../utils/utils";
import { fork } from "child_process";

async function build() {
  await cleanDist();
  await Promise.all([mjsBuild(), cjsBuild(), buildDTS()]);
  async function cleanDist() {
    if (existsSync(__DIRS.dist)) {
      await fs.rm(__DIRS.dist, { recursive: true });
      console.log("Clean dist folder");
    }
    fs.mkdir(__DIRS.dist);
    console.log("Created dist folder");
  }
  async function buildDTS() {
    const tsc = await utils.nodeModules.findNodeCLI(
      __DIRS.project,
      "typescript",
      "tsc"
    );
    const task = fork(tsc, ["--build"], { cwd: __DIRS.project });
    await utils.process.wait(task);
    console.log("DTS Build Done");
  }
  async function mjsBuild() {
    const config = getDefaultConfig();
    config.entryPoints = [path.join(__DIRS.src, "/**/*.mts")];
    config.format = "esm";
    config.outExtension = { ".js": ".mjs" };
    config.bundle = false;
    config.external = undefined;
    await esbuild.build(config);
    console.log("MJS Build Done");
  }
  async function cjsBuild() {
    const config = getDefaultConfig();
    config.entryPoints = [path.join(__DIRS.src, "/**/*.cts")];
    config.format = "cjs";
    config.outExtension = { ".js": ".cjs" };
    config.bundle = true;
    config.external = undefined;
    await esbuild.build(config);
    console.log("CJS Build Done");
  }
  function getDefaultConfig(): BuildOptions {
    return {
      outdir: __DIRS.dist,
      platform: "node",
      outbase: __DIRS.src,
      bundle: true,
      minify: true,
      sourcemap: "inline",
      define: {
        DEBUG: "false",
      },
      external: ["vite"],
    };
  }
}

await build();
