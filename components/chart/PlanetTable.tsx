"use client";

import type { ChartData, Planet } from "@/lib/astrology";
import { PLANET_GLYPHS, PLANET_NAMES, ZODIAC_BY_KEY } from "@/components/ui";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

interface PlanetTableProps {
  chartData: ChartData;
  highlightedPlanet?: Planet | null;
  onPlanetHover?: (planet: Planet | null) => void;
}

export function PlanetTable({ chartData, highlightedPlanet = null, onPlanetHover }: PlanetTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
          <th className="pb-3 text-left font-normal">Planet</th>
          <th className="pb-3 text-left font-normal">Sign</th>
          <th className="pb-3 text-right font-normal">Degree</th>
          <th className="pb-3 text-right font-normal">House</th>
        </tr>
      </thead>
      <tbody>
        {chartData.planets.map((p) => {
          const sign = ZODIAC_BY_KEY[p.sign];
          const active = highlightedPlanet === p.planet;
          return (
            <tr
              key={p.planet}
              onMouseEnter={() => onPlanetHover?.(p.planet)}
              onMouseLeave={() => onPlanetHover?.(null)}
              className={cn(
                "border-t border-[var(--gold)]/10 transition-colors",
                active ? "bg-[var(--gold)]/8" : "hover:bg-white/[0.025]",
              )}
            >
              <td className="py-2.5">
                <span className="flex items-center gap-2.5">
                  <span className="font-display text-xl text-[var(--gold-light)]">{PLANET_GLYPHS[p.planet]}</span>
                  <span className="text-[var(--text-primary-color)]">{PLANET_NAMES[p.planet]}</span>
                  {p.isRetrograde && <span className="text-[10px] text-[var(--warning)]">℞</span>}
                </span>
              </td>
              <td className="py-2.5">
                <span className="text-[var(--gold)]">{sign.glyph}</span>
                <span className="ml-1.5 text-xs text-[var(--text-secondary-color)]">{sign.name}</span>
              </td>
              <td className="py-2.5 text-right tabular-nums text-xs text-[var(--text-secondary-color)]">
                {p.degree}°{String(p.minutes).padStart(2, "0")}&apos;
              </td>
              <td className="py-2.5 text-right text-[11px] tracking-widest text-[var(--text-muted-color)]">
                {ROMAN[p.house - 1]}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
