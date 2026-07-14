import { calculateAngles, calculateHouses } from "./houses";
import { calculatePlanets } from "./ephemeris";
import { calculateAspects } from "./aspects";
import {
  SIGN_ELEMENT,
  SIGN_MODALITY,
  type ChartData,
  type ElementBalance,
  type ModalityBalance,
  type NatalInput,
} from "./types";

import { resolveUtcMs, isValidTimeZone } from "@/lib/timezone";

/** UTC instant for the birth moment. Preference order: IANA timeZone
 *  (historical offsets incl. DST) → fixed utcOffset → round(lng/15). */
function toUtcDate(input: NatalInput): Date {
  if (input.timeZone && isValidTimeZone(input.timeZone)) {
    return new Date(resolveUtcMs(input.date, input.time, input.timeZone));
  }
  const [y, m, d] = input.date.split("-").map(Number);
  const [hh, mm] = input.time.split(":").map(Number);
  const offset = input.utcOffset ?? Math.round(input.lng / 15);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - offset * 3_600_000);
}

/**
 * Full natal chart: planets, houses, aspects, angles, element/modality balance.
 * Geocentric, tropical, true-ecliptic-of-date. Placidus houses by default.
 */
export async function calculateNatalChart(input: NatalInput): Promise<ChartData> {
  const system = input.houseSystem ?? "placidus";
  const date = toUtcDate(input);

  const angles = calculateAngles(date, input.lat, input.lng);
  const houses = calculateHouses(date, input.lat, input.lng, system);
  const planets = calculatePlanets(date, input.lat, input.lng, houses);
  const aspects = calculateAspects(planets);

  // Element / modality balance over the classical planets (exclude the node).
  const elements: ElementBalance = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities: ModalityBalance = { cardinal: 0, fixed: 0, mutable: 0 };
  for (const p of planets) {
    if (p.planet === "northNode") continue;
    elements[SIGN_ELEMENT[p.sign]] += 1;
    modalities[SIGN_MODALITY[p.sign]] += 1;
  }

  return { planets, houses, aspects, angles, elements, modalities };
}

export { calculatePlanets } from "./ephemeris";
export { calculateHouses, calculateAngles, houseOf } from "./houses";
export { calculateAspects } from "./aspects";
export {
  eclipticLongitude,
  meanNorthNode,
  meanObliquityDeg,
  ramcDeg,
  signOf,
  splitDegrees,
  norm360,
} from "./engine";
export * from "./types";
