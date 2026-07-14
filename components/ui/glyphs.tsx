/* Hand-drawn line-art glyphs for signs and planets (24×24 stroke paths).
   Unicode astrological characters render as color EMOJI on Windows/Android,
   which wrecks the gold line aesthetic — these paths replace them everywhere. */

import type { ZodiacSign } from "./ZodiacIcon";
import type { Planet } from "./PlanetGlyph";

/** 24×24 viewBox, stroke-only paths (round caps). */
export const SIGN_PATHS: Record<ZodiacSign, string> = {
  aries:
    "M12 20 V10 M12 10 C12 5 8.6 3.2 6.4 5.2 C4.6 6.9 5.2 9.9 7.4 11.3 M12 10 C12 5 15.4 3.2 17.6 5.2 C19.4 6.9 18.8 9.9 16.6 11.3",
  taurus:
    "M5 4 C6.2 7.6 8.8 9.4 12 9.4 C15.2 9.4 17.8 7.6 19 4 M17.2 14.6 A5.2 5.2 0 1 1 6.8 14.6 A5.2 5.2 0 1 1 17.2 14.6",
  gemini:
    "M4.5 4.5 C9 6.3 15 6.3 19.5 4.5 M4.5 19.5 C9 17.7 15 17.7 19.5 19.5 M9 5.9 V18.1 M15 5.9 V18.1",
  cancer:
    "M4.5 8 C7.2 4.7 13 3.7 17.6 5.7 M19.5 16 C16.8 19.3 11 20.3 6.4 18.3 M19.6 9 A2.8 2.8 0 1 1 14 9 A2.8 2.8 0 1 1 19.6 9 M10 15 A2.8 2.8 0 1 1 4.4 15 A2.8 2.8 0 1 1 10 15",
  leo:
    "M9.6 15.8 A2.6 2.6 0 1 1 4.4 15.8 A2.6 2.6 0 1 1 9.6 15.8 M9.6 15.8 C9.6 12 7.8 4.2 12.6 4.2 C16.6 4.2 16 8.6 14.2 11.6 C12.6 14.2 13 17.4 15.6 17.4 C17.2 17.4 18 16.4 18.2 15.2",
  virgo:
    "M4 8.4 C4 6.6 5.4 6 6.2 6.9 C6.8 7.5 6.8 8.3 6.8 9.3 V15.6 M6.8 9.3 C6.8 6.9 10 6.3 10 9.3 V15.6 M10 9.3 C10 6.9 13.2 6.3 13.2 9.3 V15.6 M13.2 9.3 C13.2 6.9 16.4 6.3 16.4 9.3 V13.2 C16.4 16.8 18 18.6 20 18.2 M18.4 10.4 C15.7 12.1 14.8 15.6 16.2 19.8",
  libra:
    "M4 18.6 H20 M4 14.8 H8.4 M15.6 14.8 H20 M8.4 14.8 C7.6 9.6 9.6 6.2 12 6.2 C14.4 6.2 16.4 9.6 15.6 14.8",
  scorpio:
    "M4 8.4 C4 6.6 5.4 6 6.2 6.9 C6.8 7.5 6.8 8.3 6.8 9.3 V15.6 M6.8 9.3 C6.8 6.9 10 6.3 10 9.3 V15.6 M10 9.3 C10 6.9 13.2 6.3 13.2 9.3 V14.2 C13.2 17 14.6 18.6 17 18.6 L19.8 18.6 M19.8 18.6 L18 16.9 M19.8 18.6 L18 20.3",
  sagittarius:
    "M4.5 19.5 L19 5 M11.6 5 H19 V12.4 M7.4 11.4 L12.6 16.6",
  capricorn:
    "M4 6 L7.3 13.6 L10.2 6.4 M10.2 6.4 C10.2 11.6 10.2 14.8 11.9 16.9 C13.5 18.9 16.5 18.7 17.4 16.6 C18.2 14.6 16.5 12.9 14.9 13.7 C13.4 14.4 13.5 16.6 15.1 17.5",
  aquarius:
    "M4 9.8 L7.2 7 L10.4 9.8 L13.6 7 L16.8 9.8 L20 7 M4 17 L7.2 14.2 L10.4 17 L13.6 14.2 L16.8 17 L20 14.2",
  pisces:
    "M7.4 4 C4.6 8.2 4.6 15.8 7.4 20 M16.6 4 C19.4 8.2 19.4 15.8 16.6 20 M5.4 12 H18.6",
};

/** 24×24 viewBox, stroke-only paths (round caps). Filled dots are separate. */
export const PLANET_PATHS: Record<
  Planet,
  { d: string; dots?: [number, number, number][] }
> = {
  sun: {
    d: "M17.6 12 A5.6 5.6 0 1 1 6.4 12 A5.6 5.6 0 1 1 17.6 12",
    dots: [[12, 12, 1.4]],
  },
  moon: {
    d: "M14.6 3.9 A8.5 8.5 0 1 0 14.6 20.1 A6.7 6.7 0 0 1 14.6 3.9",
  },
  mercury: {
    d: "M16.2 10.6 A4.2 4.2 0 1 1 7.8 10.6 A4.2 4.2 0 1 1 16.2 10.6 M12 14.8 V21 M9.2 18 H14.8 M8.2 3 C8.2 5.6 9.8 7 12 7 C14.2 7 15.8 5.6 15.8 3",
  },
  venus: {
    d: "M17 8.6 A5 5 0 1 1 7 8.6 A5 5 0 1 1 17 8.6 M12 13.6 V21 M8.8 17.4 H15.2",
  },
  mars: {
    d: "M15.6 13.8 A5.4 5.4 0 1 1 4.8 13.8 A5.4 5.4 0 1 1 15.6 13.8 M14.2 9.8 L20 4 M14.4 4 H20 V9.6",
  },
  jupiter: {
    d: "M6 5 C9.4 4 11.5 6.4 10.6 9.4 C9.9 11.7 7.6 13.1 5 13.1 M4.5 16.4 H19.5 M15.2 20.5 V4.5",
  },
  saturn: {
    d: "M7.6 4 V19 M5 6.8 H10.2 M7.6 10.8 C10.4 8.7 14.6 9.7 14.6 13.1 C14.6 15.9 12.4 16.9 11.6 18.7 C11.2 19.9 12.1 21 13.7 20.6",
  },
  uranus: {
    d: "M15 16.8 A3 3 0 1 1 9 16.8 A3 3 0 1 1 15 16.8 M12 13.8 V5 M8 4 V11.6 M16 4 V11.6 M8 7.8 H16",
    dots: [[12, 16.8, 1]],
  },
  neptune: {
    d: "M6 4.5 C6 9.5 8.6 12 12 12 C15.4 12 18 9.5 18 4.5 M12 4.5 V21 M8.6 17.4 H15.4",
  },
  pluto: {
    d: "M14.4 5.8 A2.4 2.4 0 1 1 9.6 5.8 A2.4 2.4 0 1 1 14.4 5.8 M7 8.4 A5 5 0 0 0 17 8.4 M12 13.4 V21 M8.8 17.2 H15.2",
  },
  northNode: {
    d: "M8.3 16.9 C6.4 12.6 8.2 4.6 12 4.6 C15.8 4.6 17.6 12.6 15.7 16.9 M8.6 18.2 A2 2 0 1 1 4.6 18.2 A2 2 0 1 1 8.6 18.2 M19.4 18.2 A2 2 0 1 1 15.4 18.2 A2 2 0 1 1 19.4 18.2",
  },
  chiron: {
    d: "M15 17.2 A3.2 3.2 0 1 1 8.6 17.2 A3.2 3.2 0 1 1 15 17.2 M11.8 14 V3.5 M8.4 3.5 L11.8 7 L15.2 3.5",
  },
  lilith: {
    d: "M13.6 4.6 A5.4 5.4 0 1 0 13.6 13.4 A4.3 4.3 0 0 1 13.6 4.6 M12 13.6 V21 M8.8 17.4 H15.2",
  },
  fortune: {
    d: "M17.6 12 A5.6 5.6 0 1 1 6.4 12 A5.6 5.6 0 1 1 17.6 12 M8.1 8.1 L15.9 15.9 M15.9 8.1 L8.1 15.9",
  },
  vertex: {
    d: "M5 4 L12 20 L19 4 M9.5 12 H14.5",
  },
};

interface GlyphProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  title?: string;
}

/** Line-art zodiac glyph (replaces Unicode/emoji rendering). */
export function SignGlyph({
  sign,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 1.5,
  title,
}: GlyphProps & { sign: ZodiacSign }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path
        d={SIGN_PATHS[sign]}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Line-art planet symbol (replaces Unicode/emoji rendering). */
export function PlanetSymbol({
  planet,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 1.5,
  title,
}: GlyphProps & { planet: Planet }) {
  const g = PLANET_PATHS[planet];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path
        d={g.d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {g.dots?.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} stroke="none" />
      ))}
    </svg>
  );
}
