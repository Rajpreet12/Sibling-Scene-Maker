import React from "react";
import { AbsoluteFill } from "remotion";

export const Stage: React.FC = () => (
  <AbsoluteFill style={{ background: "#3D1E2C" }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
      <defs>
        <radialGradient id="spot" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="#E0A53C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E0A53C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1920" height="780" fill="#3D1E2C" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={i * 130} y="0" width="65" height="780" fill={i % 2 === 0 ? "#4A2536" : "#3D1E2C"} />
      ))}
      <rect x="0" y="0" width="1920" height="780" fill="url(#spot)" />

      <rect x="0" y="780" width="1920" height="300" fill="#6B4A2E" />
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={i} x1={i * 100} y1="780" x2={i * 100} y2="1080" stroke="#5A3D24" strokeWidth="3" />
      ))}
      <rect x="0" y="774" width="1920" height="10" fill="#E0A53C" opacity="0.8" />

      {/* trophy set piece */}
      <g transform="translate(1660,860)" opacity="0.9">
        <path d="M-40 0 H40 V40 A40 40 0 0 1 -40 40 Z" fill="#E0A53C" />
        <path d="M-40 6 H-70 V26 A30 30 0 0 0 -40 56Z" fill="#E0A53C" />
        <path d="M40 6 H70 V26 A30 30 0 0 1 40 56Z" fill="#E0A53C" />
        <rect x="-9" y="40" width="18" height="30" fill="#E0A53C" />
        <rect x="-30" y="70" width="60" height="14" rx="4" fill="#E0A53C" />
      </g>
    </svg>
  </AbsoluteFill>
);
