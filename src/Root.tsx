import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { SceneMaker, calculateSceneMakerMetadata, sceneMakerDefaultProps, FPS } from "./SceneMaker";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="SceneMaker"
        component={SceneMaker}
        durationInFrames={120}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={sceneMakerDefaultProps}
        calculateMetadata={calculateSceneMakerMetadata}
      />
    </>
  );
};
