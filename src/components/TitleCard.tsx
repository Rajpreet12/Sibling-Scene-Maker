import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "./backgrounds/Stage";
import { SarvgunAvatar, ElahiAvatar } from "./Avatar";
import { palette, fonts } from "../styles";
import { episodeMeta } from "../data/episode";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });

  return (
    <>
      <Stage />
      <div style={{ position: "absolute", left: "22%", bottom: 300, transform: "translateX(-50%)" }}>
        <ElahiAvatar style={{ height: 560 }} />
      </div>
      <div style={{ position: "absolute", left: "78%", bottom: 300, transform: "translateX(-50%)" }}>
        <SarvgunAvatar style={{ height: 600 }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          textAlign: "center",
          opacity: Math.min(1, pop * 1.3),
          transform: `translateY(${(1 - pop) * 20}px)`,
        }}
      >
        <div style={{ fontFamily: fonts.hand, fontSize: 26, color: "rgba(251,243,221,0.75)" }}>
          {episodeMeta.subtitle}
        </div>
        <h1
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 84,
            margin: 0,
            textShadow: "0 6px 24px rgba(0,0,0,0.45)",
          }}
        >
          <span style={{ color: palette.sarvgun }}>Sarvgun</span>{" "}
          <span style={{ color: palette.cream }}>&amp;</span>{" "}
          <span style={{ color: palette.elahi }}>Elahi</span>
        </h1>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: palette.cream, marginTop: 6 }}>
          &ldquo;{episodeMeta.title}&rdquo;
        </div>
      </div>
    </>
  );
};
