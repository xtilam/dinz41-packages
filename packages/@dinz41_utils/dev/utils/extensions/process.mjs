import u from "../utils-defines.mjs";

(function () {
  const p = u.process;
  p.wait = function (process) {
    return new Promise((resolve) => {
      if (!process) return resolve(0);
      if (process.killed || process.exitCode !== null)
        return resolve(process.exitCode);
      process.on("error", () => resolve(0));
      process.on("exit", (code) => resolve(code));
    });
  };
})();
