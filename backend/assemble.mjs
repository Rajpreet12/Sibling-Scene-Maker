import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const handlersDir = path.join(root, "src", "handlers");
const handlerFiles = readdirSync(handlersDir).filter((f) => f.endsWith(".mjs"));

rmSync(path.join(root, "dist"), { recursive: true, force: true });

for (const name of ["generate", "status"]) {
  const dir = path.join(root, "dist", name);
  mkdirSync(dir, { recursive: true });
  for (const file of handlerFiles) {
    cpSync(path.join(handlersDir, file), path.join(dir, file));
  }
  cpSync(path.join(root, "node_modules"), path.join(dir, "node_modules"), { recursive: true });
}

// frontend.mjs needs no npm deps -- just itself plus a copy of the built index.html
const frontendDir = path.join(root, "dist", "frontend");
mkdirSync(frontendDir, { recursive: true });
cpSync(path.join(handlersDir, "frontend.mjs"), path.join(frontendDir, "frontend.mjs"));
cpSync(path.join(root, "..", "frontend", "index.html"), path.join(frontendDir, "index.html"));

console.log("Assembled dist/generate, dist/status, and dist/frontend");
