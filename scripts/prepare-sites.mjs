import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");

await copyFile(
  resolve(dist, "server", "index.mjs"),
  resolve(dist, "server", "index.js"),
);

await mkdir(resolve(dist, ".openai"), { recursive: true });
await copyFile(
  resolve(root, ".openai", "hosting.json"),
  resolve(dist, ".openai", "hosting.json"),
);

console.log("Sites package prepared: dist/server/index.js");
