import { bundle } from "@remotion/bundler";
import { selectComposition, ensureBrowser } from "@remotion/renderer";
import path from "path";

const bundleLocation = await bundle({
  entryPoint: path.join(process.cwd(), "src", "index.ts"),
  outDir: path.join(process.cwd(), "build-debug"),
});
await ensureBrowser();
const composition = await selectComposition({ serveUrl: bundleLocation, id: "OneSpotLeft" });
console.log("durationInFrames:", composition.durationInFrames, "seconds:", (composition.durationInFrames/30).toFixed(1));
