import path, { join } from "path";
import {} from "../";
import { __DIRS } from "./common/dirs-defines.js";
import { utils } from "./utils/utils.js";
import { pathToFileURL } from "url";

async function main() {
  const str = JSON.stringify;
  generateCLINode("cli");

  async function generateCLINode(cliName: string) {
    const cliNodePath = path.join(__DIRS.project, cliName);
    const cliNodeWatch = path.join(__DIRS.project, "w" + cliName);
    const { findNodeCli } = utils.nodeModules;
    const { MD5File } = utils.files;
    const tsx = await findNodeCli(__DIRS.project, "tsx");
    const writeCli = new MD5File(cliNodePath).write(getContent());
    const writeWCli = new MD5File(cliNodeWatch).write(getContent(true));
    await Promise.all([
      writeCli.then(() =>
        console.log("CLI created: Run with 'node cli <script> <args>'")
      ),
      writeWCli.then(() =>
        console.log("Watch CLI created: Run with 'node wcli <script> <args>'")
      ),
    ]);
    // ----------------------------------------------
    function getContent(watch = false) {
      return [
        `process.argv.splice(1, 2, ...${arrayCode([
          str(tsx),
          watch && `"--watch"`,
          `"./dev/cli/" + process.argv[2] + ".ts"`,
        ])})`,
        `import(${str(pathToFileURL(tsx))})`,
      ].join("\n");
    }
  }
}
function arrayCode(body: any[]) {
  return scopeCode("[", "]", body).join(",").inline();
}
function scopeCode(header?: string, footer?: string, body?: any[]) {
  let tabLength = 0;
  let joinChild = ";";
  let parentTab: string;
  let childTab: string;
  let footerTab: string;
  let isParentInline = false;

  const rs = { toString, tab, join, inline };
  tab(tabLength);
  return rs;
  // ----------------------------------------------
  function toString() {
    const headStr = parentTab + `${header}` || "{";
    const footStr = footerTab + `${footer}` || "}";
    let bodyStr =
      body?.reduce((body, line) => {
        line = line && `${line}`;
        if (line) body += `${childTab}${line}${joinChild}\n`;
        return body;
      }, "") || "";
    if (bodyStr) bodyStr = `\n${bodyStr}`;
    return `${headStr}${bodyStr}${footStr}`;
  }
  function inline(parentInline = true) {
    isParentInline = parentInline;
    return rs;
  }
  function join(join = ";") {
    joinChild = join;
    return rs;
  }
  function tab(length: number) {
    tabLength = length;
    footerTab = "\t".repeat(length);
    childTab = "\t".repeat(length + 1);
    parentTab = isParentInline ? "" : footerTab;
    return rs;
  }
}

main();
