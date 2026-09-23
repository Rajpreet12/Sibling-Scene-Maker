import { Composition } from "remotion";
import { Episode } from "./Episode";
import { FPS, totalDurationInFrames } from "./data/episode";

export const MyComposition = () => {
  return (
    <Composition
      id="OneSpotLeft"
      component={Episode}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
