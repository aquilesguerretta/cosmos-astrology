import {
  D2R,
  R2D,
  norm360,
  meanObliquityDeg,
  ramcDeg,
  signOf,
} from "./engine";
import type { ChartAngles, HouseCusp, HouseSystem } from "./types";

/** Ascendant, Midheaven, Descendant, Imum Coeli (absolute longitudes). */
export function calculateAngles(date: Date, lat: number, lng: number): ChartAngles {
  const eps = meanObliquityDeg(date) * D2R;
  const ramc = ramcDeg(date, lng) * D2R;
  const phi = lat * D2R;

  const mc = norm360(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * R2D);
  const asc = norm360(
    Math.atan2(
      Math.cos(ramc),
      -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)),
    ) * R2D,
  );

  return { asc, mc, dsc: norm360(asc + 180), ic: norm360(mc + 180) };
}

/** Placidus intermediate cusp (11, 12, 2 or 3) via semi-arc fixed-point iteration. */
function placidusIntermediate(
  cuspNum: 11 | 12 | 2 | 3,
  ramc: number,
  epsDeg: number,
  latDeg: number,
): number {
  const e = epsDeg * D2R;
  const phi = latDeg * D2R;
  const seed: Record<number, number> = { 11: 30, 12: 60, 2: 120, 3: 150 };
  let lon = norm360(ramc + seed[cuspNum]);

  for (let k = 0; k < 40; k++) {
    const lr = lon * D2R;
    const dec = Math.asin(Math.sin(e) * Math.sin(lr));
    const sa = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(dec)))) * R2D;
    const na = 180 - sa;
    // meridian distance from MC as a fraction of the diurnal/nocturnal semi-arc
    let md: number;
    if (cuspNum === 11) md = sa / 3;
    else if (cuspNum === 12) md = (2 * sa) / 3;
    else if (cuspNum === 2) md = sa + na / 3;
    else md = sa + (2 * na) / 3;
    const a = (ramc + md) * D2R;
    lon = norm360(Math.atan2(Math.sin(a), Math.cos(a) * Math.cos(e)) * R2D);
  }
  return lon;
}

function toCusps(longitudes: number[]): HouseCusp[] {
  return longitudes.map((raw, i) => {
    const lon = norm360(raw);
    return {
      house: i + 1,
      longitude: lon,
      sign: signOf(lon),
      degree: lon - Math.floor(lon / 30) * 30,
    };
  });
}

/**
 * 12 house cusps for the given system. Placidus is default; whole_sign and
 * equal are exact; koch falls back to placidus (not yet implemented).
 */
export function calculateHouses(
  date: Date,
  lat: number,
  lng: number,
  system: HouseSystem = "placidus",
): HouseCusp[] {
  const { asc, mc } = calculateAngles(date, lat, lng);

  if (system === "whole_sign") {
    const start = Math.floor(asc / 30) * 30;
    return toCusps(Array.from({ length: 12 }, (_, i) => start + i * 30));
  }

  if (system === "equal") {
    return toCusps(Array.from({ length: 12 }, (_, i) => asc + i * 30));
  }

  // placidus (and koch fallback)
  const ramc = ramcDeg(date, lng);
  const eps = meanObliquityDeg(date);
  const c11 = placidusIntermediate(11, ramc, eps, lat);
  const c12 = placidusIntermediate(12, ramc, eps, lat);
  const c2 = placidusIntermediate(2, ramc, eps, lat);
  const c3 = placidusIntermediate(3, ramc, eps, lat);

  return toCusps([
    asc, // 1
    c2, // 2
    c3, // 3
    mc + 180, // 4 (IC)
    c11 + 180, // 5
    c12 + 180, // 6
    asc + 180, // 7 (DSC)
    c2 + 180, // 8
    c3 + 180, // 9
    mc, // 10 (MC)
    c11, // 11
    c12, // 12
  ]);
}

/** House (1–12) containing a given longitude, given the 12 cusps. */
export function houseOf(longitude: number, cusps: HouseCusp[]): number {
  const lon = norm360(longitude);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i].longitude;
    const b = cusps[(i + 1) % 12].longitude;
    const span = norm360(b - a);
    const off = norm360(lon - a);
    if (off < span) return i + 1;
  }
  return 1;
}
