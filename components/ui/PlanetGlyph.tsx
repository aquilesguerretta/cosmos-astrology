import { cn } from "@/lib/utils";
import { PlanetSymbol } from "./glyphs";

export type Planet =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "northNode"
  | "chiron"
  | "lilith"
  | "fortune"
  | "vertex";

/** Unicode characters — kept for plain-text contexts (PDF, AI prompts).
 *  UI must render <PlanetGlyph>/<PlanetSymbol> instead (emoji-safe). */
export const PLANET_GLYPHS: Record<Planet, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  northNode: "☊",
  chiron: "⚷",
  lilith: "⚸",
  fortune: "⊗",
  vertex: "Vx",
};

export const PLANET_NAMES: Record<Planet, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  northNode: "North Node",
  chiron: "Chiron",
  lilith: "Lilith",
  fortune: "Part of Fortune",
  vertex: "Vertex",
};

interface PlanetGlyphProps {
  planet: Planet;
  /** Icon size in px. */
  size?: number;
  color?: string;
  className?: string;
}

/** Line-art planet icon (emoji-safe SVG path). */
export function PlanetGlyph({ planet, size = 24, color, className = "" }: PlanetGlyphProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center leading-none", className)}
      style={color ? { color } : undefined}
    >
      <PlanetSymbol planet={planet} size={size} title={PLANET_NAMES[planet]} strokeWidth={size >= 40 ? 1.3 : 1.6} />
    </span>
  );
}
