import path from "path";

const projectDir = path.join(import.meta.dirname, "../../");
const devDir = path.join(projectDir, "dev");
const srcDir = path.join(projectDir, "src");
const binDir = path.join(projectDir, "bin");
const distDir = path.join(projectDir, "dist");
const testDir = path.join(projectDir, "../../test");
const curTestDir = path.join(projectDir, "/test");

export const __DIRS = {
  project: projectDir,
  dev: devDir,
  bin: binDir,
  src: srcDir,
  dist: distDir,
  test: testDir,
  curTest: curTestDir,
};
