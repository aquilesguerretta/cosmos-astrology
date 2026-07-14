import { cn } from "@/lib/utils";
import { SignGlyph } from "./glyphs";

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type Element = "Fire" | "Earth" | "Air" | "Water";

export interface ZodiacInfo {
  key: ZodiacSign;
  name: string;
  dates: string;
  element: Element;
  /** Unicode character — kept for plain-text contexts (PDF, AI prompts).
   *  UI must render <ZodiacIcon>/<SignGlyph> instead (emoji-safe). */
  glyph: string;
  ruler: string;
}

/** Canonical zodiac reference. */
export const ZODIAC: ZodiacInfo[] = [
  { key: "aries",       name: "Aries",       dates: "Mar 21 – Apr 19", element: "Fire",  glyph: "♈", ruler: "Mars" },
  { key: "taurus",      name: "Taurus",      dates: "Apr 20 – May 20", element: "Earth", glyph: "♉", ruler: "Venus" },
  { key: "gemini",      name: "Gemini",      dates: "May 21 – Jun 20", element: "Air",   glyph: "♊", ruler: "Mercury" },
  { key: "cancer",      name: "Cancer",      dates: "Jun 21 – Jul 22", element: "Water", glyph: "♋", ruler: "Moon" },
  { key: "leo",         name: "Leo",         dates: "Jul 23 – Aug 22", element: "Fire",  glyph: "♌", ruler: "Sun" },
  { key: "virgo",       name: "Virgo",       dates: "Aug 23 – Sep 22", element: "Earth", glyph: "♍", ruler: "Mercury" },
  { key: "libra",       name: "Libra",       dates: "Sep 23 – Oct 22", element: "Air",   glyph: "♎", ruler: "Venus" },
  { key: "scorpio",     name: "Scorpio",     dates: "Oct 23 – Nov 21", element: "Water", glyph: "♏", ruler: "Pluto" },
  { key: "sagittarius", name: "Sagittarius", dates: "Nov 22 – Dec 21", element: "Fire",  glyph: "♐", ruler: "Jupiter" },
  { key: "capricorn",   name: "Capricorn",   dates: "Dec 22 – Jan 19", element: "Earth", glyph: "♑", ruler: "Saturn" },
  { key: "aquarius",    name: "Aquarius",    dates: "Jan 20 – Feb 18", element: "Air",   glyph: "♒", ruler: "Uranus" },
  { key: "pisces",      name: "Pisces",      dates: "Feb 19 – Mar 20", element: "Water", glyph: "♓", ruler: "Neptune" },
];

export const ZODIAC_BY_KEY: Record<ZodiacSign, ZodiacInfo> = Object.fromEntries(
  ZODIAC.map((z) => [z.key, z]),
) as Record<ZodiacSign, ZodiacInfo>;

interface ZodiacIconProps {
  sign: ZodiacSign;
  /** Icon size in px. */
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Line-art zodiac icon. Renders a hand-drawn SVG path (never the Unicode
 * character, which Windows/Android turn into a color emoji).
 */
export function ZodiacIcon({ sign, size = 24, color, className = "" }: ZodiacIconProps) {
  const info = ZODIAC_BY_KEY[sign];
  return (
    <span
      className={cn("inline-flex items-center justify-center leading-none", className)}
      style={color ? { color } : undefined}
    >
      <SignGlyph sign={sign} size={size} title={info.name} strokeWidth={size >= 48 ? 1.2 : 1.6} />
    </span>
  );
}
