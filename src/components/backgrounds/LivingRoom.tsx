import React from "react";
import { AbsoluteFill } from "remotion";

export const LivingRoom: React.FC<{ night?: boolean }> = ({ night = false }) => {
  const wall = night ? "#141F24" : "#4F7370";
  const floor = night ? "#231A12" : "#7A5230";
  const floorEdge = night ? "#160F0A" : "#5E3E24";
  const glass = night ? "#0F2A33" : "#CFE3D8";
  const couch = night ? "#5C2A1C" : "#C9603C";
  const couchDark = night ? "#441E14" : "#A94F30";
  const frame = night ? "#8A7A5A" : "#F1E4C4";
  const frameArt = night ? "#3A4A47" : "#8FAFA6";
  const rug = night ? "#5C7A2A" : "#E0A53C";

  return (
    <AbsoluteFill style={{ background: wall }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
        <rect x="0" y="0" width="1920" height="780" fill={wall} />
        <rect x="0" y="780" width="1920" height="300" fill={floor} />
        <rect x="0" y="780" width="1920" height="14" fill={floorEdge} />

        {/* window */}
        <rect x="1420" y="90" width="360" height="420" rx="10" fill="#3E5C59" />
        <rect x="1440" y="110" width="320" height="380" rx="4" fill={glass} opacity="0.9" />
        <line x1="1600" y1="110" x2="1600" y2="490" stroke="#3E5C59" strokeWidth="8" />
        <line x1="1440" y1="300" x2="1760" y2="300" stroke="#3E5C59" strokeWidth="8" />
        {night ? (
          <>
            <circle cx="1560" cy="200" r="46" fill="#F1E4C4" opacity="0.95" />
            <circle cx="1545" cy="185" r="8" fill="#CFE3D8" opacity="0.5" />
            <circle cx="1575" cy="215" r="5" fill="#CFE3D8" opacity="0.5" />
            <circle cx="1490" cy="440" r="2.5" fill="#F1E4C4" />
            <circle cx="1710" cy="150" r="2" fill="#F1E4C4" />
            <circle cx="1690" cy="410" r="2" fill="#F1E4C4" />
            {/* moonlight beam onto the floor */}
            <polygon points="1470,510 1730,510 1980,1080 1300,1080" fill="#CFE3D8" opacity="0.08" />
          </>
        ) : (
          <path d="M1420 90 Q1600 40 1780 90" fill="none" stroke="#C9603C" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
        )}

        {/* framed picture */}
        <rect x="220" y="150" width="220" height="160" rx="6" fill={frame} stroke="#3E5C59" strokeWidth="10" />
        <rect x="245" y="175" width="170" height="110" rx="3" fill={frameArt} />

        {/* couch */}
        <rect x="60" y="700" width="620" height="150" rx="26" fill={couch} />
        <rect x="60" y="650" width="150" height="110" rx="24" fill={couch} />
        <rect x="530" y="650" width="150" height="110" rx="24" fill={couch} />
        <rect x="90" y="740" width="560" height="30" rx="14" fill={couchDark} />

        {/* rug */}
        <ellipse cx="1180" cy="960" rx="480" ry="70" fill={rug} opacity={night ? 0.35 : 0.85} />
        <ellipse cx="1180" cy="960" rx="360" ry="50" fill="none" stroke="#8A6A2A" strokeWidth="6" opacity={night ? 0.25 : 0.6} />

        {/* floor lamp -- off at night */}
        <rect x="1830" y="640" width="10" height="220" fill="#3A2E22" />
        <path d="M1790 600 L1880 600 L1860 650 L1810 650 Z" fill={night ? "#2A241C" : "#F1E4C4"} opacity="0.9" />

        {night && <rect x="0" y="0" width="1920" height="1080" fill="#0A1018" opacity="0.32" />}
      </svg>
    </AbsoluteFill>
  );
};
