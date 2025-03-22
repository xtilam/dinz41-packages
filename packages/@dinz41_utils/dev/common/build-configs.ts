import path from "path";
import { __DIRS } from "./dirs-defines.js";
import { BuildOptions } from "esbuild";

const buildConfigs: BuildOptions = {
  entryPoints: [path.join(__DIRS.src, "/**/*.ts")],
  outdir: __DIRS.dist,
  bundle: false,
  target: "node20",
  format: "esm",
  sourcemap: "inline",
  outExtension: { ".js": ".js" },
};

export default buildConfigs;
