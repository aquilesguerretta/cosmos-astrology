import { houseOf, type ChartData, type Planet } from "@/lib/astrology";

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const SYNODIC = 29.530588; // days
const MEAN_ELONGATION_PER_DAY = 360 / SYNODIC; // ~12.19°/day

export interface MoonPhaseInfo {
  angle: number; // 0–360 (Moon − Sun elongation)
  illumination: number; // 0–1
  name: string;
  description: string;
  daysToFull: number;
  daysToNew: number;
}

const PHASES: { max: number; name: string; description: string }[] = [
  { max: 22.5, name: "New Moon", description: "A clean slate — plant intentions in the dark soil." },
  { max: 67.5, name: "Waxing Crescent", description: "First green shoots; tend what you began." },
  { max: 112.5, name: "First Quarter", description: "A threshold of action — push through resistance." },
  { max: 157.5, name: "Waxing Gibbous", description: "Refine and adjust; the harvest nears." },
  { max: 202.5, name: "Full Moon", description: "Culmination and clear sight — release what is ripe." },
  { max: 247.5, name: "Waning Gibbous", description: "Share what you gathered; gratitude over grasping." },
  { max: 292.5, name: "Last Quarter", description: "Let go of the unfinished; make room." },
  { max: 337.5, name: "Waning Crescent", description: "Rest, dream, and restore before the new cycle." },
  { max: 360, name: "New Moon", description: "A clean slate — plant intentions in the dark soil." },
];

export function moonPhase(sunLon: number, moonLon: number): MoonPhaseInfo {
  const angle = norm360(moonLon - sunLon);
  const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2;
  const phase = PHASES.find((p) => angle < p.max) ?? PHASES[0];
  return {
    angle,
    illumination,
    name: phase.name,
    description: phase.description,
    daysToFull: Math.round(norm360(180 - angle) / MEAN_ELONGATION_PER_DAY),
    daysToNew: Math.round(norm360(360 - angle) / MEAN_ELONGATION_PER_DAY),
  };
}

export interface ActiveTransit {
  planet: Planet;
  house: number;
  text: string;
}

const PLANET_NAME: Partial<Record<Planet, string>> = {
  jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
};

const HOUSE_THEME: Record<number, string> = {
  1: "your self-image and the body you move through the world in",
  2: "your resources, values, and sense of worth",
  3: "your daily mind, words, and the near network",
  4: "home, roots, and the inner foundation",
  5: "creativity, romance, and the heart's wager",
  6: "work, routine, and the tending of the body",
  7: "partnership and the significant other",
  8: "intimacy, shared resources, and deep change",
  9: "belief, travel, and the search for meaning",
  10: "vocation, reputation, and the public path",
  11: "friendships, networks, and aspirations",
  12: "the unconscious, retreat, and quiet undoing",
};

/** The 3 most telling slow-planet transits through the natal houses. */
export function activeTransits(natal: ChartData, transit: ChartData): ActiveTransit[] {
  const slow: Planet[] = ["jupiter", "saturn", "uranus", "neptune", "pluto"];
  const out: ActiveTransit[] = [];
  for (const planet of slow) {
    const t = transit.planets.find((p) => p.planet === planet);
    if (!t) continue;
    const house = houseOf(t.longitude, natal.houses);
    out.push({
      planet,
      house,
      text: `${PLANET_NAME[planet]} is transiting your House ${house} — ${HOUSE_THEME[house]}.`,
    });
  }
  return out.slice(0, 3);
}
