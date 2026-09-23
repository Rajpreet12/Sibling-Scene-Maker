import React from "react";
import { Audio, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "./backgrounds/Stage";
import { SarvgunAvatar, ElahiAvatar } from "./Avatar";
import { StarIcon } from "./Icons";
import { palette, fonts } from "../styles";
import type { MoralBlock } from "../data/episode";

export const MoralCard: React.FC<{ block: MoralBlock }> = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 15, mass: 0.7 } });

  const [lessonLine, ...rest] = block.text.split(/(?<=:)\s+/);
  const restText = rest.join(" ");

  return (
    <>
      <Stage />
      <Audio src={staticFile(block.audio)} />
      <div style={{ position: "absolute", left: "16%", bottom: 300, transform: "translateX(-50%)" }}>
        <ElahiAvatar style={{ height: 460, opacity: 0.95 }} />
      </div>
      <div style={{ position: "absolute", left: "84%", bottom: 300, transform: "translateX(-50%)" }}>
        <SarvgunAvatar style={{ height: 500, opacity: 0.95 }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: "0 240px",
          textAlign: "center",
          opacity: Math.min(1, pop * 1.3),
          transform: `translateY(${(1 - pop) * 18}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StarIcon color={palette.gold} size={20} />
          <span
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: palette.gold,
            }}
          >
            Lesson Learned
          </span>
          <StarIcon color={palette.gold} size={20} />
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 40,
            color: palette.cream,
            lineHeight: 1.35,
            textShadow: "0 4px 18px rgba(0,0,0,0.4)",
          }}
        >
          {restText || lessonLine}
        </div>
      </div>
    </>
  );
};
