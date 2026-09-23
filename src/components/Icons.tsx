import React from "react";

type IconProps = { color: string; size?: number };

export const PinIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="9" r="6" fill={color} />
    <rect x="10.6" y="14" width="2.8" height="8" rx="1.4" fill={color} />
    <circle cx="9.5" cy="7" r="1.6" fill="rgba(255,255,255,0.55)" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2.5l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16.7 6.2 20.1l1.6-6.5-5.1-4.4 6.7-.5z"
      fill={color}
    />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2c.6 4.3 1.7 5.5 6 6-4.3.6-5.4 1.7-6 6-.6-4.3-1.7-5.4-6-6 4.3-.5 5.4-1.7 6-6z"
      fill={color}
    />
    <circle cx="19" cy="18" r="1.6" fill={color} />
  </svg>
);

export const BulbIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="10" r="6" fill={color} />
    <rect x="9.5" y="16" width="5" height="3" rx="1" fill={color} />
    <rect x="10" y="19.4" width="4" height="1.6" rx="0.8" fill={color} />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 3h10v5a5 5 0 0 1-10 0z" fill={color} />
    <path d="M7 4H3v2a4 4 0 0 0 4 4z" fill={color} />
    <path d="M17 4h4v2a4 4 0 0 1-4 4z" fill={color} />
    <rect x="10.7" y="13" width="2.6" height="4" fill={color} />
    <rect x="8" y="19" width="8" height="2.2" rx="1" fill={color} />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 20.5S3 14.8 3 8.9C3 5.9 5.3 4 7.8 4c1.6 0 3.2.8 4.2 2.3C13 4.8 14.6 4 16.2 4c2.5 0 4.8 1.9 4.8 4.9 0 5.9-9 11.6-9 11.6z"
      fill={color}
    />
  </svg>
);

export const AngerIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M2 12 L7 8 L10 13 L14 6 L17 13 L22 9"
      stroke={color}
      strokeWidth="2.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NoteIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="8" cy="18" r="4" fill={color} />
    <rect x="11" y="4" width="2.4" height="15" fill={color} />
    <path d="M13.4 4 C 19 5 19 10 13.4 11 Z" fill={color} />
  </svg>
);

export const PoofIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
      <line x1="6" y1="6" x2="9.5" y2="9.5" />
      <line x1="14.5" y1="14.5" x2="18" y2="18" />
      <line x1="18" y1="6" x2="14.5" y2="9.5" />
      <line x1="9.5" y1="14.5" x2="6" y2="18" />
    </g>
  </svg>
);

export const iconForFocus = (focus: string): React.FC<IconProps> | null => {
  switch (focus) {
    case "school":
      return PinIcon;
    case "idea":
      return BulbIcon;
    case "trophy":
      return TrophyIcon;
    default:
      return null;
  }
};
