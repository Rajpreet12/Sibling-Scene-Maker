import React from "react";
import { AbsoluteFill } from "remotion";

const LOCKER_COLORS = ["#E2622F", "#6E5FCB", "#E0A53C", "#4F8B7F", "#E2622F", "#6E5FCB"];

export const Hallway: React.FC = () => (
  <AbsoluteFill style={{ background: "#B9C4C2" }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
      <rect x="0" y="0" width="1920" height="780" fill="#B9C4C2" />
      <rect x="0" y="780" width="1920" height="300" fill="#9AA6A4" />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={i * 140} y1="780" x2={i * 140 + 260} y2="1080" stroke="#87938F" strokeWidth="3" opacity="0.5" />
      ))}
      <rect x="0" y="774" width="1920" height="10" fill="#7C8A87" />

      {/* lockers */}
      {LOCKER_COLORS.map((color, i) => (
        <g key={i} transform={`translate(${120 + i * 190}, 260)`}>
          <rect width="150" height="420" rx="8" fill={color} />
          <rect width="150" height="420" rx="8" fill="black" opacity="0.08" />
          <circle cx="130" cy="210" r="7" fill="#2B2118" opacity="0.5" />
          <line x1="14" y1="30" x2="136" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="4" />
        </g>
      ))}

      {/* bulletin board -- top center, clear of both characters' heads */}
      <rect x="760" y="18" width="400" height="212" rx="8" fill="#8A6A2A" />
      <rect x="785" y="38" width="350" height="172" rx="4" fill="#F1E4C4" />
      <rect x="930" y="53" width="140" height="100" fill="#FBF3DD" stroke="#D9C393" strokeWidth="3" transform="rotate(2 1000 103)" />

      {/* the sign-up flyer, front and center */}
      <g transform="rotate(-3 900 92)">
        <rect x="825" y="33" width="150" height="118" fill="#FBF3DD" stroke="#D9C393" strokeWidth="3" />
        <text x="900" y="58" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="700" fontSize="15" fill="#2B2118">
          TALENT SHOW
        </text>
        <text x="900" y="76" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="700" fontSize="15" fill="#2B2118">
          SIGN-UPS
        </text>
        <line x1="838" y1="86" x2="962" y2="86" stroke="#D9C393" strokeWidth="2" />
        <text x="900" y="124" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="800" fontSize="22" fill="#E2622F">
          1 SPOT LEFT!
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
