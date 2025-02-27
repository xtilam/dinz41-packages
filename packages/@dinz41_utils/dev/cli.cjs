module.exports = ([tsx, watch]) => {
  const { pathToFileURL } = require("url");
  const { argv } = process;

  const script = argv[2];
  process.argv.splice(1, 2);
  argv.push(tsx);
  if (watch) argv.push("--watch");
  argv.push(`./dev/cli/${script}.ts`);
  console.log(argv)
  return require(tsx);
};
