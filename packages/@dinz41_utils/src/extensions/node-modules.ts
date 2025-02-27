import path from "path";
import { dinz41 } from "../main.js";
import "./files.js";

const findNodeCli = async function (projectDir: string, module, cli = module) {
  const nodeModulesDir = path.join(projectDir, "node_modules");
  const pkgDir = path.join(nodeModulesDir, module);
  const pkgJSONPath = path.join(pkgDir, "package.json");
  const { bin } = ((await dinz41.files.readJSON(pkgJSONPath)) || {}) as any;
  const binNotFoundErr = new Error(
    `Module ${module} has no bin property in package.json`
  );
  if (!bin) throw binNotFoundErr;
  const binSubPath = bin[cli] || (module === cli ? bin : "");
  if (!binSubPath) throw binNotFoundErr;
  const binPath = path.join(pkgDir, binSubPath);
  return binPath;
};

// ----------------------------------------------
Object.assign(dinz41.nodeModules, { findNodeCli });
// ----------------------------------------------
declare global {
  namespace Dinz41 {
    interface ExtensionsNodeModules {
      findNodeCli: typeof findNodeCli;
    }
  }
}
