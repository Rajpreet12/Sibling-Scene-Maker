import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "./backgrounds/Stage";
import { palette, fonts } from "../styles";
import type { ActTitleBlock } from "../data/episode";

export const ActTitleScene: React.FC<{ block: ActTitleBlock }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });

  return (
    <>
      <Stage />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          opacity: Math.min(1, pop * 1.3),
          transform: `translateY(${(1 - pop) * 24}px)`,
        }}
      >
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: palette.gold,
            color: "#3D1E2C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 40,
            boxShadow: "0 8px 0 rgba(0,0,0,0.3)",
          }}
        >
          {block.actNumber}
        </div>
        <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 58, color: palette.cream, margin: 0 }}>
          {block.title}
        </h1>
        <div style={{ fontFamily: fonts.hand, fontSize: 30, color: "rgba(251,243,221,0.75)" }}>
          {block.subtitle}
        </div>
      </div>
    </>
  );
};
