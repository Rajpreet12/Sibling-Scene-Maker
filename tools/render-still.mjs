import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, ensureBrowser } from "@remotion/renderer";
import path from "path";

// Usage: node tools/render-still.mjs frame1:out1.png frame2:out2.png ...
const jobs = process.argv.slice(2).map((arg) => {
  const [frame, out] = arg.split(":");
  return { frame: Number(frame), out };
});

const bundleLocation = await bundle({
  entryPoint: path.join(process.cwd(), "src", "index.ts"),
  outDir: path.join(process.cwd(), "build-debug"),
});

await ensureBrowser();

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: process.env.COMPOSITION_ID || "OneSpotLeft",
});

for (const job of jobs) {
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: path.join(process.cwd(), job.out),
    frame: job.frame,
  });
  console.log("Wrote", job.out);
}
