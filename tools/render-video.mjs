import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, ensureBrowser } from "@remotion/renderer";
import path from "path";

const outFile = process.argv[2] ?? "out/one-spot-left.mp4";

console.log("Bundling...");
const bundleLocation = await bundle({
  entryPoint: path.join(process.cwd(), "src", "index.ts"),
  outDir: path.join(process.cwd(), "build-debug"),
});

await ensureBrowser();

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: "OneSpotLeft",
});

console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);

await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: "h264",
  outputLocation: path.join(process.cwd(), outFile),
  onProgress: ({ progress }) => {
    process.stdout.write(`\rProgress: ${(progress * 100).toFixed(1)}%   `);
  },
});

console.log("\nDone:", outFile);
