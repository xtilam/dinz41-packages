import { platform } from "os";
import shellBuilder from "./shell-builders/ShellBuilder.js";
import ShellItem from "./shell-builders/ShellItem.js";

export default class ShellOS {
  header: ShellItem;
  footer: ShellItem;
  fileExt = "";
  scriptLanguage: ShellLanguage;

  passAllArgs: (command: string) => string;

  static getInstance(): ShellOS {
    ShellOS.getInstance = () => instance;
    switch (platform()) {
      case "win32":
        return setInstance("bat");
      case "linux":
      default:
        return setInstance("sh");
    }
  }
}

function setInstance(lang: ShellLanguage) {
  switch (lang) {
    case "bat":
      instance.header = shellBuilder.line("@echo off");
      instance.footer = shellBuilder.line("exit");
      instance.fileExt = ".bat";
      instance.scriptLanguage = "sh";
      instance.passAllArgs = (command) => `${command} %*`;
      break;
    case "sh":
    default:
      instance.header = shellBuilder.line("#!/bin/bash");
      instance.footer = shellBuilder.line("");
      instance.fileExt = "";
      instance.scriptLanguage = "sh";
      instance.passAllArgs = (command) => `${command} "$@"`;
  }
  return instance;
}

let instance = new ShellOS();

export type ShellLanguage = "bat" | "sh";
