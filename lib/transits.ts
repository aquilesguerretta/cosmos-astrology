import { houseOf, type ChartData, type Planet } from "@/lib/astrology";

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const SYNODIC = 29.530588; // days
const MEAN_ELONGATION_PER_DAY = 360 / SYNODIC; // ~12.19°/day

export type MoonPhaseKey =
  | "newMoon"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "fullMoon"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent";

export interface MoonPhaseInfo {
  angle: number; // 0–360 (Moon − Sun elongation)
  illumination: number; // 0–1
  phaseKey: MoonPhaseKey; // display names/descriptions come from the i18n dict
  daysToFull: number;
  daysToNew: number;
}

const PHASE_BOUNDS: { max: number; key: MoonPhaseKey }[] = [
  { max: 22.5, key: "newMoon" },
  { max: 67.5, key: "waxingCrescent" },
  { max: 112.5, key: "firstQuarter" },
  { max: 157.5, key: "waxingGibbous" },
  { max: 202.5, key: "fullMoon" },
  { max: 247.5, key: "waningGibbous" },
  { max: 292.5, key: "lastQuarter" },
  { max: 337.5, key: "waningCrescent" },
  { max: 360, key: "newMoon" },
];

export function moonPhase(sunLon: number, moonLon: number): MoonPhaseInfo {
  const angle = norm360(moonLon - sunLon);
  const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2;
  const phaseKey = (PHASE_BOUNDS.find((p) => angle < p.max) ?? PHASE_BOUNDS[0]).key;
  return {
    angle,
    illumination,
    phaseKey,
    daysToFull: Math.round(norm360(180 - angle) / MEAN_ELONGATION_PER_DAY),
    daysToNew: Math.round(norm360(360 - angle) / MEAN_ELONGATION_PER_DAY),
  };
}

export interface ActiveTransit {
  planet: Planet;
  house: number;
}

/** Slow-planet transits through the natal houses (text is built from the dict). */
export function activeTransits(natal: ChartData, transit: ChartData): ActiveTransit[] {
  const slow: Planet[] = ["jupiter", "saturn", "uranus", "neptune", "pluto"];
  const out: ActiveTransit[] = [];
  for (const planet of slow) {
    const t = transit.planets.find((p) => p.planet === planet);
    if (!t) continue;
    out.push({ planet, house: houseOf(t.longitude, natal.houses) });
  }
  return out.slice(0, 3);
}
