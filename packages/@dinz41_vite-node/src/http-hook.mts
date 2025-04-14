import "@dinz41/utils/plugins/safe-promise";
import { LoadHook, ResolveHook } from "module";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { picocolors } from "./libs/pc.cjs";

const baseDir = path.resolve(".");
const baseDirURL = pathToFileURL(path.resolve(".")).href;
const pkgJSONFileURL = baseDirURL + "/package.json";
const browserNodeExternal = `/__vite-browser-external:`;
const mapResolveCache = new Map<
  string,
  { url: URL; format: string; isVirtualModule?: boolean }
>();
const mapResolveResult = new Map<string, { content: string; map: any }>();
// const log = (action, ...args) =>
//   console.log(picocolors.green(`[${action}]`), ...args);
const log = (...args) => {};
const errLog = (action, ...args) =>
  console.error(picocolors.red(`[${action}]`), ...args);
const pause = () => new Promise(() => {});
let origin: string;

export const resolve: ResolveHook = async function (
  specifier,
  context,
  nextResolve
) {
  let subPath: string;
  let searchString = "";
  await specifierHandler();
  if (subPath.startsWith(browserNodeExternal)) {
    let moduleName = subPath.slice(browserNodeExternal.length);
    return nextResolve(moduleName, context);
  }
  let cacheResolve = mapResolveCache.get(subPath);

  if (
    !cacheResolve ||
    (cacheResolve.url.search !== searchString &&
      cacheResolve.format !== "commonjs")
  ) {
    const [format, url] = await getCacheModule();
    mapResolveCache.set(subPath, (cacheResolve = { url, format }));
  } else {
    // log("RESOLVE_CACHE_SKIP", subPath);
  }
  if (cacheResolve.format === "commonjs")
    return nextResolve(cacheResolve.url.href, context);
  return { url: cacheResolve.url.href, format: "module", shortCircuit: true };
  // ----------------------------------------------
  async function getCacheModule(): Promise<
    [format: string, url: URL, isVirtualModule?: boolean]
  > {
    let resolveFileURL = new URL(baseDirURL + subPath);
    let moduleResolve = await tryResolve(resolveFileURL.href);
    if (moduleResolve?.format === "commonjs") {
      return ["commonjs", resolveFileURL];
    }
    if (DEBUG) log("FETCH", subPath + searchString);
    const viteResolve = await fetchJSON(origin + "@resolve" + subPath);
    if (!viteResolve.resolve) {
      if (!viteResolve.content) throw new Error(`Invalid path: ${specifier}`);
      const fakeURL = new URL(pkgJSONFileURL);
      fakeURL.searchParams.set("path", subPath);
      fakeURL.searchParams.set("search", resolveFileURL.search);
      mapResolveResult.set(fakeURL.href, {
        content: viteResolve.content.code,
        map: viteResolve.content.map,
      });
      return ["module", fakeURL];
    }
    const isVirtualModule = !!viteResolve.resolve;
    resolveFileURL = isVirtualModule
      ? new URL(baseDirURL + subPath)
      : new URL("file:///" + viteResolve.resolve);
    resolveFileURL.search = "";
    moduleResolve = !isVirtualModule && (await tryResolve(resolveFileURL.href));
    if (moduleResolve?.format === "commonjs") {
      return ["commonjs", resolveFileURL];
    }
    resolveFileURL.search = searchString;
    mapResolveResult.set(resolveFileURL.href, {
      content: viteResolve.content.code,
      map: viteResolve.content.map,
    });
    return ["module", resolveFileURL, isVirtualModule];
  }
  async function tryResolve(url: string) {
    try {
      return await nextResolve(url, { parentURL: pkgJSONFileURL });
    } catch (e) {}
  }
  async function specifierHandler() {
    if (specifier.startsWith("/@id")) specifier = specifier.slice(4);
    if (specifier.startsWith("file:/")) {
      const fileURL = new URL(specifier);
      searchString = fileURL.search;
      const filePath = fileURLToPath(
        searchString
          ? fileURL.href.slice(0, -searchString.length)
          : fileURL.href
      );
      subPath = getSubPath(baseDir, filePath).replaceAll(path.sep, "/");
      if (!subPath) throw new Error(`Invalid path: ${filePath}`);
      return;
    }
    if (specifier.startsWith("/")) {
      const fileURL = new URL(baseDirURL + specifier);
      searchString = fileURL.search;
      const filePath = fileURLToPath(
        searchString
          ? fileURL.href.slice(0, -searchString.length)
          : fileURL.href
      );
      subPath = getSubPath(baseDir, filePath).replaceAll(path.sep, "/");
      return;
    }

    log("RESOLVE_?", specifier);
    await pause();
  }
};

export const load = async function (urlLoad, context, nextLoad) {
  if (!urlLoad.startsWith("file:/")) return nextLoad(urlLoad, context);
  const resolveData = mapResolveResult.get(urlLoad);
  if (!resolveData) return nextLoad(urlLoad, context);
  if (DEBUG) log("LOAD", urlLoad);
  mapResolveResult.delete(urlLoad);
  return {
    shortCircuit: true,
    source: resolveData.content,
    format: "module",
  };
} as LoadHook;

async function init() {
  origin = process.env.__VITE_URL__;
}

// UTILS
// ----------------------------------------------
function getSubPath(parentPath: string, childPath: string) {
  const relative = path.relative(parentPath, childPath);
  if (!relative) return "";
  if (relative.startsWith("..")) return "";
  if (path.isAbsolute(relative)) return "";
  return path.sep + relative;
}

async function fetchContent(url: string) {
  return await fetch(url).then((res) => res.text());
}
async function fetchJSON(url: string) {
  return await fetchContent(url)
    .then((res) => JSON.parse(res))
    .catch(() => null);
}
// ----------------------------------------------
if (DEBUG) {
  if (!globalThis.__VITE_DEV__) await init();
  else console.log("[WATCH]", import.meta.filename);
} else {
  await init();
}
