import path from "path";
import { __DIRS } from "./dirs-defines.mjs";

/**@type {import("esbuild").BuildOptions} */
export const buildConfigs = {
  entryPoints: [path.join(__DIRS.src, "/**/*.ts")],
  outdir: __DIRS.dist,
  bundle: false,
  target: "node20",
  format: "esm",
  sourcemap: "inline",
  outExtension: { ".js": ".js" },
};
