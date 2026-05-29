import { signedDelta } from "./engine";
import type { Aspect, AspectType, PlanetPosition } from "./types";

interface AspectDef {
  type: AspectType;
  angle: number;
  orb: number;
  harmonious: boolean;
}

const ASPECT_DEFS: AspectDef[] = [
  { type: "conjunction", angle: 0, orb: 8, harmonious: true },
  { type: "opposition", angle: 180, orb: 8, harmonious: false },
  { type: "trine", angle: 120, orb: 6, harmonious: true },
  { type: "square", angle: 90, orb: 6, harmonious: false },
  { type: "sextile", angle: 60, orb: 4, harmonious: true },
  { type: "quincunx", angle: 150, orb: 2, harmonious: false },
];

/** All aspects between the given positions, using the orbs above. */
export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const out: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const delta = signedDelta(p1.longitude, p2.longitude); // (-180,180]
      const sep = Math.abs(delta); // 0..180

      let best: AspectDef | null = null;
      let bestOrb = Infinity;
      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(sep - def.angle);
        if (orb <= def.orb && orb < bestOrb) {
          best = def;
          bestOrb = orb;
        }
      }
      if (!best) continue;

      // Applying: the orb is closing. d|delta|/dt = sign(delta) * (speed1 - speed2).
      const dAbs = Math.sign(delta) * (p1.speed - p2.speed);
      const isApplying = sep > best.angle ? dAbs < 0 : dAbs > 0;

      out.push({
        planet1: p1.planet,
        planet2: p2.planet,
        type: best.type,
        orb: Number(bestOrb.toFixed(2)),
        isApplying,
        isHarmonious: best.harmonious,
      });
    }
  }

  return out;
}
