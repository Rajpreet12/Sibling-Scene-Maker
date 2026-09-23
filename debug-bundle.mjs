import { bundle } from "@remotion/bundler";
import path from "path";

try {
  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), "src", "index.ts"),
    outDir: path.join(process.cwd(), "build-debug"),
    onProgress: (p) => console.log("progress", p),
    webpackOverride: (config) => config,
  });
  console.log("DONE:", bundleLocation);
} catch (err) {
  console.error("BUNDLE ERROR:");
  console.error(err);
  process.exit(1);
}
