import { Plugin, PluginOption, ResolvedConfig } from "vite";
import { builtinModules } from "module";
import { CodeJoin } from "@dinz41/utils/libs/CodeJoin";

const jsCode = {
  lines: () => new CodeJoin().useListLine(";"),
  scope: (begin) => new CodeJoin().useListLine("").useScope(begin + " {", "}"),
};

type TransformCallback = Plugin["transform"];

export const dinzViteNode = () => {
  const setExternals = defaultExternals();
  const actionTransform = new Set<TransformCallback>([transformClient]);
  const viteBrowser = "__vite-browser-external:";
  const resolvePrefix = "/@resolve/";
  let config: ResolvedConfig;
  let isServe = false;

  return {
    name: "dinz-vite-node",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isServe = config.command === "serve";
      config.optimizeDeps.exclude.forEach((item) => setExternals.add(item));
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith(resolvePrefix)) return next();
        const modulePath = req.url.slice(resolvePrefix.length);
        const module = await server.pluginContainer.resolveId(modulePath);
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            modulePath,
            resolve: module?.id,
            content: await server.transformRequest('/' + modulePath),
          })
        );
      });
    },
    async transform(code, id, options) {
      if (actionTransform.size === 0) return;
      for (const action of actionTransform) {
        const result = await (action as any)?.call(this, id, code, options);
        if (result) return result;
      }
    },
  } as PluginOption;
};

const transformClient: TransformCallback = function (id, code) {
  if (!id.endsWith("/node_modules/vite/dist/client/client.mjs")) return;
  // console.log(this);
  const beginCode = jsCode
    .lines()
    .add(`import.meta.url = new URL(globalThis.__VITE_CONTEXT__.url)`)
    .add(`const WebSocket = globalThis.__VITE_CONTEXT__.WebSocket`)
    .add(`const console = globalThis.__VITE_CONTEXT__.console`)
    .add(`globalThis._window = globalThis.window`)
    .add(`globalThis._document = globalThis.document`)
    .add(`delete globalThis.window`)
    .add(`delete globalThis.document`)
    .getContent();

  const endCode = jsCode
    .lines()
    .add(`globalThis.document = globalThis._document`)
    .add(`globalThis.window = globalThis._window`)
    .add(`delete globalThis._document`)
    .add(`delete globalThis._window`)
    .getContent();
  return {
    code: [beginCode, code, endCode].join("\n"),
  };
};

export function defaultExternals() {
  return new Set([
    ...builtinModules,
    ...builtinModules.map((v) => "node:" + v),
  ]);
}
