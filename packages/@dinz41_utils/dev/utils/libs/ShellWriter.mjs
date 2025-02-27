import fs from "fs/promises";
import { platform } from "os";
import path from "path";
import "../plugins/safe-promise.mjs";

export class ShellWriter {
  /**@type {OSShellScriptConfig} */ osConfig = {};
  /**@type {string}*/ binDir = "";
  /**@type {Map<string, string[]>}*/ mapScripts = new Map();
  
  getCommandWithArgs(command) {
    const { passArgs } = this.osConfig;
    return `${command} ${passArgs}`;
  }
  addShellJS(/**@type {string}*/ jsPath, watchMode = false, name = "") {
    if (!name) {
      name = path.basename(jsPath, path.extname(jsPath));
      if (watchMode) name += "-watch";
    }
    this.addShellFile(name, [
      this.getCommandWithArgs(`node ${watchMode ? "--watch " : ""}${jsPath}`),
    ]);
  }
  addShellFile(name = "", content = []) {
    const { header, footer } = this.osConfig;
    this.mapScripts.set(name, [...header, ...content, ...footer]);
  }
  findOSConfig() {
    const setConfig = (passArgs, header = [], ext = "", footer = []) => {
      this.osConfig = { scriptExtension: ext, header, footer, passArgs };
    };
    // ----------------------------------------------
    switch (platform()) {
      case "win32":
        return setConfig("%*", ["@echo off"], ".bat");
      case "linux":
      case "darwin":
      default:
        return setConfig("$@", ["#!/bin/bash"], ".sh");
    }
  }
  async clearBinDir() {
    if (!this.#isBinDirExists()) return;
    const { scriptExtension } = this.osConfig;
    const invalidFiles = (await fs.readdir(this.binDir)).filter((file) => {
      const fileExt = path.extname(file);
      if (fileExt !== scriptExtension) return true;
      const fileName = path.basename(file, fileExt);
      if (!this.mapScripts.has(fileName)) return true;
      return false;
    });
    await Promise.all(
      invalidFiles.map(async (file) => {
        const filePath = path.join(this.binDir, file);
        await fs.unlink(filePath);
        console.log(`Deleted ${filePath}`);
      })
    );
  }
  async writeAll() {
    const { mapScripts, osConfig, binDir } = this;
    const { scriptExtension } = osConfig;
    const entries = Array.from(mapScripts.entries());
    if (!this.#isBinDirExists()) await fs.mkdir(binDir, { recursive: true });
    await Promise.all(
      entries.map(async ([name, content]) => {
        const filePath = path.join(binDir, name + scriptExtension);
        content = content.join("\n");
        const oldContent = (await fs.readFile(filePath, "utf-8").safe()).value;
        if (oldContent && oldContent === content)
          return console.log(`Skipped ${filePath}`);
        await fs.writeFile(filePath, content);
        console.log(`Wrote ${filePath}`);
      })
    );
  }
  async #isBinDirExists() {
    if (!this.binDir)
      throw new Error("Please set binDir before calling this method");
    return !!(await fs.stat(this.binDir).safe()).value;
  }
}

/**
 * @typedef OSShellScriptConfig
 * @property {string} scriptExtension
 * @property {string[]} header
 * @property {string[]} footer
 * @property {string} passArgs
 */
