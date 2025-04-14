import path from "path";

const projectDir = path.join(import.meta.dirname, "../../");
const devDir = path.join(projectDir, "dev/");
const srcDir = path.join(projectDir, "src/");
const distDir = path.join(projectDir, "dist/");

export const __DIRS = {
  project: projectDir,
  dev: devDir,
  src: srcDir,
  dist: distDir,
};
