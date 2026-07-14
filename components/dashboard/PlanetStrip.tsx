"use client";

import type { PlanetPosition } from "@/lib/astrology";
import { PLANET_GLYPHS, ZODIAC_BY_KEY } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";

export function PlanetStrip({ planets }: { planets: PlanetPosition[] }) {
  const { dict } = useI18n();
  return (
    <div className="glass flex gap-px divide-x divide-[var(--gold)]/10 overflow-x-auto">
      {planets
        .filter((p) => p.planet !== "northNode")
        .map((p) => (
          <div key={p.planet} className="group min-w-[92px] flex-1 px-3 py-4 text-center transition hover:bg-white/[0.02]">
            <p className="font-display text-2xl text-[var(--gold-light)] group-hover:text-[var(--gold)]">
              {PLANET_GLYPHS[p.planet]}
              {p.isRetrograde && <span className="ml-0.5 align-super text-[10px] text-[var(--warning)]">℞</span>}
            </p>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
              {dict.planets[p.planet]}
            </p>
            <p className="mt-1 text-sm text-[var(--text-primary-color)]">
              {ZODIAC_BY_KEY[p.sign].glyph}
              <span className="ml-1 text-[11px] text-[var(--text-secondary-color)]">{p.degree}°</span>
            </p>
          </div>
        ))}
    </div>
  );
}
