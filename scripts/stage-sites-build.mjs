import { access, cp, mkdir, readdir, rename, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const openNextDirectory = resolve(root, ".open-next");
const outputDirectory = resolve(root, "dist");
const serverDirectory = resolve(outputDirectory, "server");

await access(resolve(openNextDirectory, "worker.js"));
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(serverDirectory, { recursive: true });

for (const entry of await readdir(openNextDirectory, { withFileTypes: true })) {
  if (entry.name === "assets") continue;
  await cp(resolve(openNextDirectory, entry.name), resolve(serverDirectory, entry.name), {
    recursive: entry.isDirectory(),
  });
}

await rename(resolve(serverDirectory, "worker.js"), resolve(serverDirectory, "index.js"));
await cp(resolve(openNextDirectory, "assets"), resolve(outputDirectory, "assets"), { recursive: true });

console.log("Sites build staged in dist/.");
