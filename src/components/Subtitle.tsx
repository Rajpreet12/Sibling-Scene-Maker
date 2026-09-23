import React from "react";
import { fonts, speakerColor, speakerName } from "../styles";

export const Subtitle: React.FC<{ line: { speaker: string; text: string }; entrance: number }> = ({
  line,
  entrance,
}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: 90,
      transform: `translateX(-50%) translateY(${(1 - entrance) * 16}px)`,
      opacity: entrance,
      maxWidth: 1200,
      background: "rgba(20,16,12,0.72)",
      borderRadius: 16,
      padding: "18px 30px",
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      backdropFilter: "blur(2px)",
    }}
  >
    <span
      style={{
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        padding: "4px 12px",
        borderRadius: 999,
        color: speakerColor(line.speaker).fg,
        background: speakerColor(line.speaker).bg,
        flex: "none",
      }}
    >
      {speakerName(line.speaker)}
    </span>
    <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, color: "#FBF3DD", lineHeight: 1.3 }}>
      {line.text}
    </span>
  </div>
);
