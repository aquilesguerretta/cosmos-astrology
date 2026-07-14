"use client";

import type { ChartData, Planet } from "@/lib/astrology";
import { PlanetSymbol, SignGlyph } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

interface PlanetTableProps {
  chartData: ChartData;
  highlightedPlanet?: Planet | null;
  onPlanetHover?: (planet: Planet | null) => void;
}

export function PlanetTable({ chartData, highlightedPlanet = null, onPlanetHover }: PlanetTableProps) {
  const { dict } = useI18n();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[380px] text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
            <th className="pb-3 text-left font-normal">{dict.chart.colPlanet}</th>
            <th className="pb-3 text-left font-normal">{dict.chart.colSign}</th>
            <th className="pb-3 text-right font-normal">{dict.chart.colDegree}</th>
            <th className="pb-3 text-right font-normal">{dict.chart.colHouse}</th>
          </tr>
        </thead>
        <tbody>
          {chartData.planets.map((p) => {
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
                    <span className="text-[var(--gold-light)]">
                      <PlanetSymbol planet={p.planet} size={18} strokeWidth={1.7} />
                    </span>
                    <span className="text-[var(--text-primary-color)]">{dict.planets[p.planet]}</span>
                    {p.isRetrograde && <span className="text-[10px] text-[var(--warning)]">℞</span>}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[var(--gold)]">
                      <SignGlyph sign={p.sign} size={14} strokeWidth={2} />
                    </span>
                    <span className="text-xs text-[var(--text-secondary-color)]">
                      {dict.zodiac.names[p.sign]}
                    </span>
                  </span>
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
    </div>
  );
}
