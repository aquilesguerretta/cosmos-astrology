import {
  eclipticLongitude,
  meanNorthNode,
  signedDelta,
  signOf,
  splitDegrees,
  ENGINE_BODIES,
  type EngineBody,
} from "./engine";
import { calculateHouses, houseOf } from "./houses";
import type { HouseCusp, Planet, PlanetPosition } from "./types";

const HALF_DAY_MS = 43_200_000;

/** Longitude + instantaneous speed (deg/day) via 1-day centered difference. */
function longitudeAndSpeed(body: EngineBody, date: Date): { lon: number; speed: number } {
  const lon = eclipticLongitude(body, date);
  const before = eclipticLongitude(body, new Date(date.getTime() - HALF_DAY_MS));
  const after = eclipticLongitude(body, new Date(date.getTime() + HALF_DAY_MS));
  return { lon, speed: signedDelta(after, before) }; // span = 1 day
}

/**
 * Geocentric tropical positions for Sun..Pluto + (mean) North Node.
 * Houses are assigned from `cusps` if given, else Placidus is computed.
 *
 * NB: chiron, lilith, fortune and vertex are part of the Planet type but not
 * yet computed here (chiron needs a dedicated ephemeris; the others are derived
 * points added at the chart level later).
 */
export function calculatePlanets(
  date: Date,
  lat: number,
  lng: number,
  cusps?: HouseCusp[],
): PlanetPosition[] {
  const houseCusps = cusps ?? calculateHouses(date, lat, lng, "placidus");
  const positions: PlanetPosition[] = [];

  for (const body of ENGINE_BODIES) {
    const { lon, speed } = longitudeAndSpeed(body, date);
    const { degree, minutes } = splitDegrees(lon);
    positions.push({
      planet: body as Planet,
      longitude: lon,
      sign: signOf(lon),
      degree,
      minutes,
      house: houseOf(lon, houseCusps),
      isRetrograde: speed < 0,
      speed: Number(speed.toFixed(4)),
    });
  }

  // North Node (mean) — always retrograde in mean motion.
  const nodeLon = meanNorthNode(date);
  const { degree, minutes } = splitDegrees(nodeLon);
  positions.push({
    planet: "northNode",
    longitude: nodeLon,
    sign: signOf(nodeLon),
    degree,
    minutes,
    house: houseOf(nodeLon, houseCusps),
    isRetrograde: true,
    speed: -0.0529,
  });

  return positions;
}
