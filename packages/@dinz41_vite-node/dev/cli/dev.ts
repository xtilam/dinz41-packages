import esbuild, { BuildOptions, Plugin } from "esbuild";
import { createWriteStream } from "fs";
import fs from "fs/promises";
import path from "path";
import { __DIRS } from "../common/path-defines";

async function main() {
  mjsWatch();
  cjsWatch();
  async function mjsWatch() {
    const config = getDefaultConfig();
    config.entryPoints = [path.join(__DIRS.src, "/**/*.mts")];
    config.format = "esm";
    config.outExtension = { ".js": ".mjs" };
    config.bundle = false;
    config.external = undefined;

    const context = await esbuild.context(config);
    await context.watch();
  }
  async function cjsWatch() {
    const config = getDefaultConfig();
    config.entryPoints = [path.join(__DIRS.src, "/**/*.cts")];
    config.format = "cjs";
    config.outExtension = { ".js": ".cjs" };
    config.bundle = true;
    config.external = undefined;
    config.minify = true;
    config.legalComments = "eof";
    const context = await esbuild.context(config);
    await context.watch();
  }
  function getDefaultConfig(): BuildOptions {
    const logPlugin: Plugin = {
      name: "log",
      setup(build) {
        build.onEnd(() =>
          console.log(
            "[BUILD_DONE]",
            build.initialOptions.format?.toUpperCase()
          )
        );
      },
    };
    return {
      outdir: __DIRS.dist,
      outbase: __DIRS.src,
      platform: "node",
      bundle: true,
      minify: false,
      sourcemap: "external",
      define: {
        DEBUG: "true",
      },
      external: ["vite"],
      plugins: [logPlugin],
    };
  }
}

main();
