import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { palette, fonts } from "../styles";
import { PinIcon, StarIcon, SparkleIcon, BulbIcon, TrophyIcon } from "./Icons";
import type { Focus } from "../data/episode";

const TagIcon: React.FC<{ focus: Focus }> = ({ focus }) => {
  const size = 18;
  switch (focus) {
    case "sarvgun":
      return <StarIcon color={palette.sarvgun} size={size} />;
    case "elahi":
      return <SparkleIcon color={palette.elahi} size={size} />;
    case "idea":
      return <BulbIcon color={palette.gold} size={size} />;
    case "trophy":
      return <TrophyIcon color={palette.gold} size={size} />;
    default:
      return <PinIcon color={palette.gold} size={size} />;
  }
};

export const SceneTag: React.FC<{ sceneNumber: number; title: string; focus: Focus }> = ({
  sceneNumber,
  title,
  focus,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, 65, 85], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [0, 12], [-16, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 56,
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(20,16,12,0.55)",
        borderRadius: 999,
        padding: "10px 20px 10px 16px",
      }}
    >
      <TagIcon focus={focus} />
      <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15, color: "rgba(251,243,221,0.7)" }}>
        Scene {sceneNumber}
      </span>
      <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 20, color: palette.cream }}>
        {title}
      </span>
    </div>
  );
};
