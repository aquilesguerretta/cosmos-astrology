/* Deep test suite for the astrology engine + timezone resolution.
   Run: npm run test:engine  (npx tsx scripts/test-engine.ts) */
import { calculateNatalChart, norm360, type ChartData, type NatalInput } from "../lib/astrology";
import { offsetForZone } from "../lib/timezone";

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(label: string, ok: boolean, detail = "") {
  if (ok) {
    passed++;
  } else {
    failed++;
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const close = (a: number, b: number, tol: number) => Math.abs(((a - b + 540) % 360) - 180) <= tol;

async function chartInvariants(name: string, input: NatalInput): Promise<ChartData> {
  const c = await calculateNatalChart(input);

  check(`${name}: 12 cusps`, c.houses.length === 12);
  check(`${name}: 11 bodies`, c.planets.length === 11);

  const allFinite =
    c.houses.every((h) => Number.isFinite(h.longitude)) &&
    c.planets.every((p) => Number.isFinite(p.longitude) && Number.isFinite(p.speed)) &&
    [c.angles.asc, c.angles.mc, c.angles.dsc, c.angles.ic].every(Number.isFinite);
  check(`${name}: all longitudes finite`, allFinite);

  check(
    `${name}: cusp 1 == ASC`,
    close(c.houses[0].longitude, c.angles.asc, 0.01),
    `cusp1=${c.houses[0].longitude.toFixed(2)} asc=${c.angles.asc.toFixed(2)}`,
  );
  check(
    `${name}: cusp 10 == MC`,
    close(c.houses[9].longitude, c.angles.mc, 0.01),
  );

  for (let i = 0; i < 6; i++) {
    check(
      `${name}: cusp ${i + 7} opposite cusp ${i + 1}`,
      close(c.houses[i + 6].longitude, c.houses[i].longitude + 180, 0.01),
    );
  }

  for (const a of c.aspects) {
    const maxOrb =
      a.type === "conjunction" || a.type === "opposition" ? 8
      : a.type === "trine" || a.type === "square" ? 6
      : a.type === "sextile" ? 4
      : 2;
    check(`${name}: aspect orb bound (${a.planet1}-${a.planet2} ${a.type})`, a.orb <= maxOrb + 1e-9, `orb=${a.orb}`);
  }

  const elTotal = Object.values(c.elements).reduce((s, n) => s + n, 0);
  const modTotal = Object.values(c.modalities).reduce((s, n) => s + n, 0);
  check(`${name}: element tally = 10`, elTotal === 10, String(elTotal));
  check(`${name}: modality tally = 10`, modTotal === 10, String(modTotal));

  return c;
}

(async () => {
  console.log("── 1. Reference chart: Rio 2004-09-21 08:30 (America/Sao_Paulo) ──");
  const rio = await calculateNatalChart({
    date: "2004-09-21",
    time: "08:30",
    lat: -22.9068,
    lng: -43.1729,
    timeZone: "America/Sao_Paulo",
  });
  const sun = rio.planets.find((p) => p.planet === "sun")!;
  const moon = rio.planets.find((p) => p.planet === "moon")!;
  check("Rio: Sun = Virgo 28°49'", close(sun.longitude, 178.817, 0.05), sun.longitude.toFixed(3));
  check("Rio: Moon = Sag 26°24'", close(moon.longitude, 266.4, 0.05), moon.longitude.toFixed(3));
  check("Rio: Sun house 11", sun.house === 11, String(sun.house));
  check("Rio: Moon house 2", moon.house === 2, String(moon.house));

  console.log("── 2. Historical timezone offsets (DST-aware, via Intl) ──");
  const tz = (d: string, t: string, z: string) => offsetForZone(d, t, z);
  check("São Paulo 2004-01-01 = -2 (summer time)", tz("2004-01-01", "12:00", "America/Sao_Paulo") === -2);
  check("São Paulo 2004-09-21 = -3", tz("2004-09-21", "08:30", "America/Sao_Paulo") === -3);
  check("São Paulo 2024-01-01 = -3 (DST abolished 2019)", tz("2024-01-01", "12:00", "America/Sao_Paulo") === -3);
  // Portugal ran on CET (UTC+1) from Sep 1992 until Mar 1996 — the tz database
  // knows this; a naive longitude-based guess (0) would be an hour off.
  check("Lisbon 1996-03-14 = +1 (CET era 1992–96)", tz("1996-03-14", "04:27", "Europe/Lisbon") === 1);
  check("Lisbon 1996-07-01 = +1 (WEST)", tz("1996-07-01", "12:00", "Europe/Lisbon") === 1);
  check("New York 2000-07-04 = -4 (EDT)", tz("2000-07-04", "12:00", "America/New_York") === -4);
  check("New York 2000-01-01 = -5 (EST)", tz("2000-01-01", "12:00", "America/New_York") === -5);
  check("Tokyo any = +9", tz("1990-06-15", "09:00", "Asia/Tokyo") === 9);
  check("Sydney 2000-01-01 = +11 (AEDT)", tz("2000-01-01", "12:00", "Australia/Sydney") === 11);
  check("Mumbai = +5.5", tz("2010-03-03", "10:00", "Asia/Kolkata") === 5.5);

  console.log("── 3. House-system invariants across the globe ──");
  const worldCases: [string, NatalInput][] = [
    ["Lisbon 1996", { date: "1996-03-14", time: "04:27", lat: 38.7223, lng: -9.1393, timeZone: "Europe/Lisbon" }],
    ["Tokyo 1988", { date: "1988-11-02", time: "23:45", lat: 35.6762, lng: 139.6503, timeZone: "Asia/Tokyo" }],
    ["Sydney 2001 (southern)", { date: "2001-01-20", time: "06:10", lat: -33.8688, lng: 151.2093, timeZone: "Australia/Sydney" }],
    ["New York 1969", { date: "1969-07-20", time: "20:17", lat: 40.7128, lng: -74.006, timeZone: "America/New_York" }],
    ["Cairo 1975", { date: "1975-05-05", time: "14:00", lat: 30.0444, lng: 31.2357, timeZone: "Africa/Cairo" }],
    ["Mumbai 1990 (half-hour tz)", { date: "1990-12-25", time: "03:33", lat: 19.076, lng: 72.8777, timeZone: "Asia/Kolkata" }],
    ["Quito (equator)", { date: "2010-06-01", time: "12:00", lat: -0.1807, lng: -78.4678, timeZone: "America/Guayaquil" }],
    ["Reykjavik 64°N (high lat)", { date: "1985-02-10", time: "18:30", lat: 64.1466, lng: -21.9426, timeZone: "Atlantic/Reykjavik" }],
    ["Tromsø 69.6°N (extreme)", { date: "2000-06-21", time: "12:00", lat: 69.6492, lng: 18.9553, timeZone: "Europe/Oslo" }],
  ];
  for (const [name, input] of worldCases) {
    await chartInvariants(name, input);
  }

  console.log("── 4. Whole-sign system ──");
  const ws = await calculateNatalChart({
    date: "1996-03-14", time: "04:27", lat: 38.7223, lng: -9.1393,
    timeZone: "Europe/Lisbon", houseSystem: "whole_sign",
  });
  check("whole-sign: all cusps at 30° multiples", ws.houses.every((h) => Math.abs(h.longitude % 30) < 1e-6));
  const ascSignIdx = Math.floor(norm360(ws.angles.asc) / 30);
  check("whole-sign: cusp 1 opens the ASC sign", Math.floor(ws.houses[0].longitude / 30) === ascSignIdx);

  console.log("── 5. Astronomical sanity ──");
  const equinox = await calculateNatalChart({ date: "2024-03-20", time: "12:00", lat: 0, lng: 0, utcOffset: 0 });
  const eqSun = equinox.planets.find((p) => p.planet === "sun")!;
  check("Equinox 2024-03-20: Sun ≈ 0° Aries", eqSun.longitude < 1 || eqSun.longitude > 359, eqSun.longitude.toFixed(3));

  const jan = await calculateNatalChart({ date: "2020-01-01", time: "12:00", lat: 0, lng: 0, utcOffset: 0 });
  check("2020-01-01: Sun in Capricorn", jan.planets.find((p) => p.planet === "sun")!.sign === "capricorn");
  const jul = await calculateNatalChart({ date: "2020-07-04", time: "12:00", lat: 0, lng: 0, utcOffset: 0 });
  check("2020-07-04: Sun in Cancer", jul.planets.find((p) => p.planet === "sun")!.sign === "cancer");

  const moonSpeed = rio.planets.find((p) => p.planet === "moon")!.speed;
  check("Moon speed ≈ 11–15°/day", moonSpeed > 11 && moonSpeed < 15.5, String(moonSpeed));
  const sunSpeed = rio.planets.find((p) => p.planet === "sun")!.speed;
  check("Sun speed ≈ 0.95–1.02°/day", sunSpeed > 0.95 && sunSpeed < 1.02, String(sunSpeed));

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.error("\nFAILURES:");
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
  }
  console.log("✓ engine + timezone suite fully green");
})();
