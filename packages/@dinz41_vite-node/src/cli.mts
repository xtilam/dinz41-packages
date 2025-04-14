import { Commander } from "./libs/commander.cjs";
import { ViteNode } from "./ViteNodeRunner.mjs";

const commander = new Commander();

commander.requiredOption("-s, --script <script>", "Vite script");
commander.requiredOption("-p, --port <port>", "Vite port", parseInt);
const { port, script } = commander.parse(process.argv).opts();
new ViteNode(port, script).runProc()
