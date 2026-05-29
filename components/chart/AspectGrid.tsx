"use client";

import { useMemo, useState } from "react";
import type { Aspect, ChartData, Planet } from "@/lib/astrology";
import { PLANET_GLYPHS, PLANET_NAMES } from "@/components/ui";
import { ASPECT_META } from "./aspectMeta";

const GRID_PLANETS: Planet[] = [
  "sun", "moon", "mercury", "venus", "mars",
  "jupiter", "saturn", "uranus", "neptune", "pluto",
];

const key = (a: Planet, b: Planet) => [a, b].sort().join("|");

interface AspectGridProps {
  chartData: ChartData;
}

export function AspectGrid({ chartData }: AspectGridProps) {
  const [hover, setHover] = useState<Aspect | null>(null);

  const lookup = useMemo(() => {
    const m = new Map<string, Aspect>();
    for (const a of chartData.aspects) m.set(key(a.planet1, a.planet2), a);
    return m;
  }, [chartData]);

  return (
    <div>
      <table className="border-collapse">
        <tbody>
          {GRID_PLANETS.map((row, i) => (
            <tr key={row}>
              {GRID_PLANETS.slice(0, i).map((col) => {
                const asp = lookup.get(key(row, col));
                const meta = asp ? ASPECT_META[asp.type] : null;
                return (
                  <td
                    key={col}
                    className="h-7 w-7 border border-[var(--gold)]/10 text-center align-middle"
                    onMouseEnter={() => asp && setHover(asp)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: asp ? "pointer" : "default" }}
                  >
                    {meta && (
                      <span className="text-sm" style={{ color: meta.color }} title={`${meta.label} · orb ${asp!.orb}°`}>
                        {meta.symbol}
                      </span>
                    )}
                  </td>
                );
              })}
              {/* diagonal planet label */}
              <td className="h-7 w-7 border border-[var(--gold)]/10 text-center align-middle">
                <span className="font-display text-base text-[var(--gold-light)]">{PLANET_GLYPHS[row]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 h-5 text-xs text-[var(--text-secondary-color)]">
        {hover ? (
          <span>
            <span className="text-[var(--gold-light)]">{PLANET_NAMES[hover.planet1]}</span>
            <span className="mx-1.5" style={{ color: ASPECT_META[hover.type].color }}>{ASPECT_META[hover.type].symbol}</span>
            <span className="text-[var(--gold-light)]">{PLANET_NAMES[hover.planet2]}</span>
            <span className="ml-2 text-[var(--text-muted-color)]">
              {ASPECT_META[hover.type].label} · orb {hover.orb}° · {hover.isApplying ? "applying" : "separating"}
            </span>
          </span>
        ) : (
          <span className="text-[var(--text-muted-color)]">Hover an aspect for details</span>
        )}
      </div>
    </div>
  );
}
