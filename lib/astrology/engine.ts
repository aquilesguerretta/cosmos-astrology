/* Thin wrapper around astronomy-engine (Don Cross, MIT) — pure JS, Vercel-safe.
   NB: the CLAUDE.md spec named this swisseph.ts; we use astronomy-engine instead
   (swisseph-v2 is a native node-gyp addon that can't run on serverless). All
   positions are GEOCENTRIC, TROPICAL, true-ecliptic-of-date — i.e. astrology. */
import {
  Body,
  GeoVector,
  GeoMoon,
  Rotation_EQJ_ECT,
  RotateVector,
  SiderealTime,
} from "astronomy-engine";
import { SIGN_ORDER, type ZodiacSign } from "./types";

export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;
export const norm360 = (x: number): number => ((x % 360) + 360) % 360;

/** Normalize an angular difference into (-180, 180]. */
export const signedDelta = (a: number, b: number): number => ((a - b + 540) % 360) - 180;

export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}
export function julianCenturies(date: Date): number {
  return (julianDay(date) - 2451545) / 36525;
}

/** Mean obliquity of the ecliptic (degrees), Laskar/IAU polynomial. */
export function meanObliquityDeg(date: Date): number {
  const t = julianCenturies(date);
  return (84381.448 - 46.815 * t - 0.00059 * t * t + 0.001813 * t * t * t) / 3600;
}

/** Right Ascension of the Midheaven (degrees) = local apparent sidereal time. */
export function ramcDeg(date: Date, lngEast: number): number {
  return norm360(SiderealTime(date) * 15 + lngEast);
}

const BODY_MAP = {
  sun: Body.Sun, moon: Body.Moon, mercury: Body.Mercury, venus: Body.Venus,
  mars: Body.Mars, jupiter: Body.Jupiter, saturn: Body.Saturn,
  uranus: Body.Uranus, neptune: Body.Neptune, pluto: Body.Pluto,
} as const;

export type EngineBody = keyof typeof BODY_MAP;
export const ENGINE_BODIES = Object.keys(BODY_MAP) as EngineBody[];

/** Geocentric apparent ecliptic longitude of date (degrees, 0–360). */
export function eclipticLongitude(body: EngineBody, date: Date): number {
  const b = BODY_MAP[body];
  const vec = b === Body.Moon ? GeoMoon(date) : GeoVector(b, date, true);
  const v = RotateVector(Rotation_EQJ_ECT(date), vec); // EQJ -> ecliptic true of date
  return norm360(Math.atan2(v.y, v.x) * R2D);
}

/** Mean lunar ascending node (North Node) longitude, degrees. Meeus. */
export function meanNorthNode(date: Date): number {
  const t = julianCenturies(date);
  return norm360(125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000);
}

export function signOf(longitude: number): ZodiacSign {
  return SIGN_ORDER[Math.floor(norm360(longitude) / 30)];
}

/** Split an absolute longitude into whole degrees + arcminutes within its sign. */
export function splitDegrees(longitude: number): { degree: number; minutes: number } {
  const n = norm360(longitude);
  const within = n - Math.floor(n / 30) * 30;
  let degree = Math.floor(within);
  let minutes = Math.round((within - degree) * 60);
  if (minutes === 60) {
    minutes = 0;
    degree += 1;
  }
  return { degree, minutes };
}
