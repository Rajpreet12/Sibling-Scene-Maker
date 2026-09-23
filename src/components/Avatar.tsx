import React from "react";
import { useFace } from "../useFace";

type AvatarProps = {
  style?: React.CSSProperties;
  bounce?: number; // -1..1, vertical bob offset in px
  talking?: boolean;
};

export const SarvgunAvatar: React.FC<AvatarProps> = ({ style, bounce = 0, talking = false }) => {
  const { mouthOpen, blinking, wiggle } = useFace(talking);
  return (
    <svg
      viewBox="0 0 120 140"
      style={{ transform: `translateY(${bounce}px) rotate(${wiggle}deg)`, ...style }}
    >
      <ellipse cx="60" cy="128" rx="30" ry="6" fill="rgba(20,20,20,0.18)" />

      {/* long hair, worn down */}
      <path d="M45 22 C32 40, 30 75, 37 118" stroke="#2A1B10" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M75 22 C88 40, 90 75, 83 118" stroke="#2A1B10" strokeWidth="15" fill="none" strokeLinecap="round" />

      <path d="M40 74 L80 74 L88 132 L32 132 Z" fill="#E2622F" />
      <rect x="46" y="118" width="9" height="16" rx="4" fill="#3A2E22" />
      <rect x="65" y="118" width="9" height="16" rx="4" fill="#3A2E22" />
      <path
        d="M40 78 Q20 70 22 52"
        stroke="#E2622F"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M80 78 Q92 60 84 44"
        stroke="#E2622F"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="84" cy="43" r="4.5" fill="#E0A53C" />
      <circle cx="60" cy="34" r="19" fill="#D9A066" />

      {/* fringe */}
      <path d="M42 26 Q60 8 78 26 Q78 17 60 15 Q42 17 42 26Z" fill="#2A1B10" />
      {/* colorful hair ties near the crown */}
      <circle cx="49" cy="17" r="3.2" fill="#4FA8D8" />
      <circle cx="71" cy="17" r="3.2" fill="#E8C34F" />

      {blinking ? (
        <>
          <line x1="51" y1="35" x2="55" y2="35" stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="65" y1="35" x2="69" y2="35" stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="53" cy="35" r="2" fill="#2B2118" />
          <circle cx="67" cy="35" r="2" fill="#2B2118" />
        </>
      )}
      {mouthOpen ? (
        <ellipse cx="60" cy="44" rx="4.5" ry="4" fill="#5A2A1E" />
      ) : (
        <path d="M54 42 Q60 46 66 42" stroke="#2B2118" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};

export const ElahiAvatar: React.FC<AvatarProps> = ({ style, bounce = 0, talking = false }) => {
  const { mouthOpen, blinking, wiggle } = useFace(talking);
  return (
    <svg
      viewBox="0 0 120 140"
      style={{ transform: `translateY(${bounce}px) rotate(${wiggle}deg)`, ...style }}
    >
      <ellipse cx="60" cy="128" rx="26" ry="5.5" fill="rgba(20,20,20,0.18)" />
      <path d="M44 82 L76 82 L82 130 L38 130 Z" fill="#6E5FCB" />
      <rect x="48" y="116" width="8" height="14" rx="4" fill="#3A2E22" />
      <rect x="64" y="116" width="8" height="14" rx="4" fill="#3A2E22" />
      <path d="M76 92 L98 84" stroke="#3A2E22" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(88,66)">
        <path
          d="M12 2c.6 4.3 1.7 5.5 6 6-4.3.6-5.4 1.7-6 6-.6-4.3-1.7-5.4-6-6 4.3-.5 5.4-1.7 6-6z"
          fill="#E0A53C"
          transform="scale(0.7)"
        />
      </g>
      <path
        d="M44 86 Q30 90 26 78"
        stroke="#6E5FCB"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />

      {/* curly hair puffs */}
      <circle cx="34" cy="40" r="8" fill="#2A1B10" />
      <circle cx="30" cy="52" r="6.5" fill="#2A1B10" />
      <circle cx="86" cy="40" r="8" fill="#2A1B10" />
      <circle cx="90" cy="52" r="6.5" fill="#2A1B10" />
      <circle cx="60" cy="19" r="8" fill="#2A1B10" />

      <circle cx="60" cy="40" r="17" fill="#D9A066" />
      <path d="M45 34 Q60 20 75 34 Q75 26 60 24 Q45 26 45 34Z" fill="#2A1B10" />

      {/* flower headband */}
      <path d="M41 30 Q60 15 79 30" stroke="#EFA9C6" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="45" cy="24" r="3.4" fill="#EFA9C6" />
      <circle cx="41" cy="27" r="3.4" fill="#EFA9C6" />
      <circle cx="44" cy="30" r="3.4" fill="#EFA9C6" />
      <circle cx="48" cy="27.5" r="3.4" fill="#EFA9C6" />
      <circle cx="44.5" cy="27" r="2" fill="#E0A53C" />

      <circle cx="40" cy="36" r="7" fill="#2A1B10" />
      <circle cx="80" cy="36" r="7" fill="#2A1B10" />

      {blinking ? (
        <>
          <line x1="52" y1="41" x2="56" y2="41" stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="64" y1="41" x2="68" y2="41" stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="54" cy="41" r="2" fill="#2B2118" />
          <circle cx="66" cy="41" r="2" fill="#2B2118" />
        </>
      )}
      {mouthOpen ? (
        <ellipse cx="60" cy="49" rx="4" ry="3.6" fill="#5A2A1E" />
      ) : (
        <path d="M55 47 Q60 50 65 47" stroke="#2B2118" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};
