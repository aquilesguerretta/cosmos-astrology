import { signedDelta } from "./engine";
import type { AspectType, ChartData, Planet } from "./types";

export interface SynastryAspect {
  planetA: Planet;
  planetB: Planet;
  type: AspectType;
  orb: number;
  isHarmonious: boolean;
}

export type SynastryType = "love" | "friendship" | "work" | "family";

export interface SynastryResult {
  score: number; // 0–100
  type: SynastryType;
  label: string;
  strengths: string[];
  challenges: string[];
  aspects: SynastryAspect[];
}

interface Hit {
  type: AspectType;
  orb: number;
  harmonious: boolean;
}

const DEFS: { type: AspectType; angle: number; orb: number; harmonious: boolean }[] = [
  { type: "conjunction", angle: 0, orb: 8, harmonious: true },
  { type: "opposition", angle: 180, orb: 8, harmonious: false },
  { type: "trine", angle: 120, orb: 6, harmonious: true },
  { type: "square", angle: 90, orb: 6, harmonious: false },
  { type: "sextile", angle: 60, orb: 4, harmonious: true },
  { type: "quincunx", angle: 150, orb: 2, harmonious: false },
];

const ASPECT_SCORE: Record<AspectType, number> = {
  trine: 1,
  sextile: 0.85,
  conjunction: 0.82,
  quincunx: 0.5,
  opposition: 0.4,
  square: 0.3,
};

const NAME: Record<Planet, string> = {
  sun: "Sun", moon: "Moon", mercury: "Mercury", venus: "Venus", mars: "Mars",
  jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune",
  pluto: "Pluto", northNode: "North Node", chiron: "Chiron", lilith: "Lilith",
  fortune: "Fortune", vertex: "Vertex",
};

function aspectBetween(lonA: number, lonB: number): Hit | null {
  const sep = Math.abs(signedDelta(lonA, lonB));
  let best: Hit | null = null;
  let bestOrb = Infinity;
  for (const d of DEFS) {
    const orb = Math.abs(sep - d.angle);
    if (orb <= d.orb && orb < bestOrb) {
      best = { type: d.type, orb: Number(orb.toFixed(2)), harmonious: d.harmonious };
      bestOrb = orb;
    }
  }
  return best;
}

const lonOf = (c: ChartData, p: Planet) => c.planets.find((x) => x.planet === p)?.longitude;

function pairScore(a: ChartData, b: ChartData, pa: Planet, pb: Planet): number {
  const la = lonOf(a, pa);
  const lb = lonOf(b, pb);
  if (la == null || lb == null) return 0.5;
  const hit = aspectBetween(la, lb);
  return hit ? ASPECT_SCORE[hit.type] : 0.5;
}

function labelFor(score: number): string {
  if (score >= 90) return "Soul Mates";
  if (score >= 75) return "A Perfect Match";
  if (score >= 60) return "Great Potential";
  if (score >= 45) return "Worth the Effort";
  return "Mutual Growth";
}

const PERSONAL: Planet[] = ["sun", "moon", "mercury", "venus", "mars"];

/** Average of a planet pair scored in both directions (A→B and B→A). */
function crossScore(a: ChartData, b: ChartData, pa: Planet, pb: Planet): number {
  return (pairScore(a, b, pa, pb) + pairScore(a, b, pb, pa)) / 2;
}

/** A benefic/malefic vs both luminaries, both directions. */
function planetToLuminaries(a: ChartData, b: ChartData, planet: Planet): number {
  return (
    (pairScore(a, b, planet, "sun") +
      pairScore(a, b, planet, "moon") +
      pairScore(a, b, "sun", planet) +
      pairScore(a, b, "moon", planet)) / 4
  );
}

/**
 * Per-bond weighting — each relationship kind listens to different planet
 * pairs (the method taught in the Academy). Weights sum to 0.8; the remaining
 * 0.2 is the overall harmony of every inter-aspect.
 */
function weightedCore(a: ChartData, b: ChartData, type: SynastryType, ascAsc: number): number {
  const sun = pairScore(a, b, "sun", "sun");
  const moon = pairScore(a, b, "moon", "moon");
  switch (type) {
    case "friendship":
      return (
        crossScore(a, b, "mercury", "mercury") * 0.2 +
        moon * 0.2 +
        planetToLuminaries(a, b, "jupiter") * 0.15 +
        sun * 0.15 +
        ascAsc * 0.1
      );
    case "work":
      return (
        crossScore(a, b, "mercury", "mercury") * 0.2 +
        planetToLuminaries(a, b, "saturn") * 0.2 +
        crossScore(a, b, "mars", "mars") * 0.15 +
        sun * 0.15 +
        ascAsc * 0.1
      );
    case "family":
      return (
        moon * 0.25 +
        planetToLuminaries(a, b, "saturn") * 0.15 +
        crossScore(a, b, "venus", "venus") * 0.15 +
        sun * 0.15 +
        ascAsc * 0.1
      );
    case "love":
    default:
      return (
        sun * 0.2 +
        moon * 0.2 +
        crossScore(a, b, "venus", "mars") * 0.15 +
        crossScore(a, b, "moon", "sun") * 0.15 +
        ascAsc * 0.1
      );
  }
}

/** Synastry between two natal charts, weighted for the kind of bond. */
export function calculateSynastry(
  a: ChartData,
  b: ChartData,
  type: SynastryType = "love",
): SynastryResult {
  // all inter-aspects
  const aspects: SynastryAspect[] = [];
  for (const pa of a.planets) {
    for (const pb of b.planets) {
      const hit = aspectBetween(pa.longitude, pb.longitude);
      if (hit) {
        aspects.push({
          planetA: pa.planet,
          planetB: pb.planet,
          type: hit.type,
          orb: hit.orb,
          isHarmonious: hit.harmonious,
        });
      }
    }
  }

  // weighted score — core pairs by bond type + overall harmony
  const ascHit = aspectBetween(a.angles.asc, b.angles.asc);
  const ascAsc = ascHit ? ASPECT_SCORE[ascHit.type] : 0.5;
  const others = aspects.length
    ? aspects.filter((x) => x.isHarmonious).length / aspects.length
    : 0.5;

  const score = Math.round((weightedCore(a, b, type, ascAsc) + others * 0.2) * 100);

  // notable aspects → strengths / challenges (prefer personal-planet contacts, tightest orb)
  const weight = (x: SynastryAspect) =>
    (PERSONAL.includes(x.planetA) ? 0 : 5) + (PERSONAL.includes(x.planetB) ? 0 : 5) + x.orb;
  const sorted = [...aspects].sort((p, q) => weight(p) - weight(q));
  const phrase = (x: SynastryAspect) => `${NAME[x.planetA]} ${x.type} ${NAME[x.planetB]} (orb ${x.orb}°)`;

  const strengths = sorted.filter((x) => x.isHarmonious).slice(0, 4).map(phrase);
  const challenges = sorted.filter((x) => !x.isHarmonious).slice(0, 4).map(phrase);

  return { score, type, label: labelFor(score), strengths, challenges, aspects: sorted };
}
