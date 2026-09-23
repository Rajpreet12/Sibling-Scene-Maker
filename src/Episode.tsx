import React from "react";
import { Sequence } from "remotion";
import { blocks } from "./data/episode";
import { SceneScene } from "./components/SceneScene";
import { ActTitleScene } from "./components/ActTitleScene";
import { TitleCard } from "./components/TitleCard";
import { EndCard } from "./components/EndCard";
import { MoralCard } from "./components/MoralCard";

export const Episode: React.FC = () => {
  return (
    <>
      {blocks.map((block, i) => (
        <Sequence key={i} from={block.startFrame} durationInFrames={block.durationInFrames}>
          {block.kind === "title-card" && <TitleCard />}
          {block.kind === "end-card" && <EndCard />}
          {block.kind === "act-title" && <ActTitleScene block={block} />}
          {block.kind === "scene" && <SceneScene scene={block} />}
          {block.kind === "moral-card" && <MoralCard block={block} />}
        </Sequence>
      ))}
    </>
  );
};
