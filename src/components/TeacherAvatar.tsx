import React from "react";
import { useFace } from "../useFace";

type AvatarProps = {
  style?: React.CSSProperties;
  bounce?: number;
  talking?: boolean;
};

export const TeacherAvatar: React.FC<AvatarProps> = ({ style, bounce = 0, talking = false }) => {
  const { mouthOpen, blinking, wiggle } = useFace(talking);
  return (
    <svg viewBox="0 0 120 160" style={{ transform: `translateY(${bounce}px) rotate(${wiggle}deg)`, ...style }}>
      <ellipse cx="60" cy="152" rx="32" ry="6" fill="rgba(20,20,20,0.18)" />
      <path d="M38 92 L82 92 L90 148 L30 148 Z" fill="#8A6A2A" />
      <rect x="52" y="86" width="16" height="14" fill="#F1E4C4" />
      <rect x="46" y="134" width="9" height="16" rx="4" fill="#3A2E22" />
      <rect x="65" y="134" width="9" height="16" rx="4" fill="#3A2E22" />
      <path d="M38 96 Q22 100 22 116" stroke="#8A6A2A" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M82 96 Q98 104 96 120" stroke="#8A6A2A" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="88" y="112" width="20" height="26" rx="2" fill="#F1E4C4" stroke="#D9C393" strokeWidth="1.5" />
      <line x1="92" y1="119" x2="104" y2="119" stroke="#8A6A2A" strokeWidth="1.4" />
      <line x1="92" y1="124" x2="104" y2="124" stroke="#8A6A2A" strokeWidth="1.4" />
      <line x1="92" y1="129" x2="100" y2="129" stroke="#8A6A2A" strokeWidth="1.4" />
      <circle cx="60" cy="52" r="20" fill="#D9A066" />
      <path d="M40 46 Q60 24 80 46 Q80 34 60 32 Q40 34 40 46Z" fill="#4A3527" />
      <circle cx="60" cy="30" r="8" fill="#4A3527" />
      <circle cx="52" cy="53" r="6.5" fill="none" stroke="#3A2E22" strokeWidth="2" />
      <circle cx="68" cy="53" r="6.5" fill="none" stroke="#3A2E22" strokeWidth="2" />
      <line x1="58.5" y1="53" x2="61.5" y2="53" stroke="#3A2E22" strokeWidth="2" />
      {blinking ? (
        <>
          <line x1="50" y1="53" x2="54" y2="53" stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="66" y1="53" x2="70" y2="53" stroke="#2B2118" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="52" cy="53" r="2" fill="#2B2118" />
          <circle cx="68" cy="53" r="2" fill="#2B2118" />
        </>
      )}
      {mouthOpen ? (
        <ellipse cx="60" cy="62" rx="4.5" ry="4" fill="#5A2A1E" />
      ) : (
        <path d="M54 61 Q60 64 66 61" stroke="#2B2118" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};
