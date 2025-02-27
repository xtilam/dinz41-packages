import shellBuilder from "../core/shell-writer/shell-builders/ShellBuilder.js";
import ShellBin from "../core/shell-writer/ShellBin.js";
import ShellFile from "../core/shell-writer/ShellFile.js";
import ShellOS from "../core/shell-writer/ShellOS.js";
import ShellProject from "../core/shell-writer/ShellProject.js";

const shellWriter = {
  os: ShellOS.getInstance(),
  builder: shellBuilder,
  File: ShellFile,
  BinFolder: ShellBin,
  Project: ShellProject,
};

export default shellWriter;
