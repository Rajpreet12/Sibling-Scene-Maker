import React from "react";
import { Stage } from "./backgrounds/Stage";
import { StarIcon } from "./Icons";
import { palette, fonts } from "../styles";

const NEXT_UP = [
  { title: "The Great Backyard Bake-Off", note: "A kitchen turf war over one cake-judging trophy." },
  { title: "The Treasure Map Problem", note: "An old backyard map, two sisters, zero agreement on directions." },
  { title: "Do Not Lose This Hamster", note: "Neighbor's pet, one afternoon, everything that could go wrong." },
];

export const EndCard: React.FC = () => (
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
        gap: 44,
      }}
    >
      <div style={{ fontFamily: fonts.hand, fontSize: 48, color: palette.cream }}>~ fin ~</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        {NEXT_UP.map((n) => (
          <div key={n.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ marginTop: 4 }}>
              <StarIcon color={palette.gold} size={16} />
            </div>
            <div>
              <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 20, color: palette.cream }}>
                {n.title}
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 15, color: "rgba(251,243,221,0.65)" }}>{n.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);
