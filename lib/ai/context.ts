/* Builders for AI grounding context — the FULL natal chart plus today's sky,
   so "ask the stars" answers are personal, not generic. Server-side only. */

import type { ChartData } from "@/lib/astrology";
import { signOf } from "@/lib/astrology";
import { moonPhase, activeTransits } from "@/lib/transits";
import type { Dict } from "@/lib/i18n/en";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Compact but complete natal summary: every placement, the angles and the
 *  five tightest aspects. */
export function buildChartSummary(chart: ChartData, dict: Dict, name: string): string {
  const placements = chart.planets
    .map(
      (p) =>
        `${dict.planets[p.planet]} ${dict.zodiac.names[p.sign]} ${p.degree}°${String(p.minutes).padStart(2, "0")}' (${dict.common.house} ${ROMAN[p.house - 1]}${p.isRetrograde ? " ℞" : ""})`,
    )
    .join("; ");

  const ascSign = signOf(chart.angles.asc);
  const mcSign = signOf(chart.angles.mc);

  const aspects = [...chart.aspects]
    .sort((a, b) => a.orb - b.orb)
    .slice(0, 5)
    .map(
      (a) =>
        `${dict.planets[a.planet1]} ${dict.aspects[a.type].toLowerCase()} ${dict.planets[a.planet2]} (${a.orb}°)`,
    )
    .join("; ");

  return (
    `${name} — ASC ${dict.zodiac.names[ascSign]}, MC ${dict.zodiac.names[mcSign]}. ` +
    `${placements}. ` +
    `${dict.chart.aspectMatrix}: ${aspects}.`
  );
}

/** Today's sky measured AGAINST the natal chart: transit positions, the slow
 *  planets' natal houses, and the moon phase. */
export function buildDailyContext(
  natal: ChartData,
  transit: ChartData,
  dict: Dict,
  dateLabel: string,
): string {
  const sky = transit.planets
    .filter((p) => p.planet !== "northNode")
    .map(
      (p) =>
        `${dict.planets[p.planet]} ${dict.zodiac.names[p.sign]}${p.isRetrograde ? ` (${dict.common.retrograde})` : ""}`,
    )
    .join(", ");

  const hits = activeTransits(natal, transit)
    .map((t) => `${dict.planets[t.planet]} → ${dict.common.house} ${t.house} (${dict.transits.houses[t.house]})`)
    .join("; ");

  const tSun = transit.planets.find((p) => p.planet === "sun")!;
  const tMoon = transit.planets.find((p) => p.planet === "moon")!;
  const phase = moonPhase(tSun.longitude, tMoon.longitude);

  return (
    `${dateLabel}. ` +
    `${dict.sanctum.positionsTitle}: ${sky}. ` +
    `${dict.moon[phase.phaseKey]} (${Math.round(phase.illumination * 100)}% ${dict.moon.illuminated}). ` +
    `${dict.sanctum.transitsLabel}: ${hits}.`
  );
}
