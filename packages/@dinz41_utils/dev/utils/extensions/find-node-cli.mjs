import path from "path";
import { __DIRS } from "../../common/dirs-defines.mjs";
import u from "../utils-defines.mjs";
import "../plugins/safe-promise.mjs";
import "./files.mjs";

u.findNodeCli = async function (module, cli = module) {
  const nodeModulesDir = path.join(__DIRS.project, "node_modules");
  const pkgDir = path.join(nodeModulesDir, module);
  const pkgJSONPath = path.join(pkgDir, "package.json");
  const { bin } = (await u.files.readJSON(pkgJSONPath)) || {};
  const binNotFoundErr = new Error(
    `Module ${module} has no bin property in package.json`
  );
  if (!bin) throw binNotFoundErr;
  const binSubPath = bin[cli] || (module === cli ? bin : "");
  if (!binSubPath) throw binNotFoundErr;
  console.log({ pkgDir, binSubPath });
  const binPath = path.join(pkgDir, binSubPath);
  return binPath;
};
