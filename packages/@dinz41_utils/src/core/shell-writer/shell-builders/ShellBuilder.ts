import path from "path";
import ShellItem from "./ShellItem.js";
import ShellLine from "./ShellLine.js";

export class ShellBuilder extends ShellItem {
  line(...args: ConstructorParameters<typeof ShellLine>) {
    return new ShellLine(...args);
  }
  node(scriptPath: string) {
    scriptPath = path.resolve(scriptPath);
    return this.passArgs("node" + scriptPath);
  }
  passArgs(command: string) {
    return new ShellLine(this.os.passAllArgs(command));
  }
}

const shellBuilder = new ShellBuilder();
export default shellBuilder;
