import { cn } from "@/lib/utils";

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
  /** Glyph size in px. */
  size?: number;
  color?: string;
  className?: string;
}

/** Renders a planet glyph in the display face — matches the figma design. */
export function PlanetGlyph({ planet, size = 24, color, className = "" }: PlanetGlyphProps) {
  return (
    <span
      role="img"
      aria-label={PLANET_NAMES[planet]}
      className={cn(
        "font-display inline-flex items-center justify-center leading-none",
        className,
      )}
      style={{ fontSize: size, color }}
    >
      {PLANET_GLYPHS[planet]}
    </span>
  );
}
