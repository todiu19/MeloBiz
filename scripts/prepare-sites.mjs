import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const frontendDist = resolve(root, "frontend", "dist");
const outputDist = resolve(root, "dist");

await rm(outputDist, { recursive: true, force: true });
await cp(frontendDist, outputDist, { recursive: true });

await copyFile(
  resolve(outputDist, "server", "index.mjs"),
  resolve(outputDist, "server", "index.js"),
);

await mkdir(resolve(outputDist, ".openai"), { recursive: true });
await copyFile(
  resolve(root, ".openai", "hosting.json"),
  resolve(outputDist, ".openai", "hosting.json"),
);

console.log("Sites package prepared from frontend/dist.");
