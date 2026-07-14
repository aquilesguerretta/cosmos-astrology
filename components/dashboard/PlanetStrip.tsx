"use client";

import type { PlanetPosition } from "@/lib/astrology";
import { PlanetSymbol, SignGlyph } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";

export function PlanetStrip({ planets }: { planets: PlanetPosition[] }) {
  const { dict } = useI18n();
  return (
    <div className="glass flex gap-px divide-x divide-[var(--gold)]/10 overflow-x-auto">
      {planets
        .filter((p) => p.planet !== "northNode")
        .map((p) => (
          <div key={p.planet} className="group min-w-[92px] flex-1 px-3 py-4 text-center transition hover:bg-white/[0.02]">
            <div className="relative mx-auto flex h-8 w-8 items-center justify-center text-[var(--gold-light)] transition group-hover:text-[var(--gold)]">
              <PlanetSymbol planet={p.planet} size={26} strokeWidth={1.6} />
              {p.isRetrograde && (
                <span className="absolute -right-2 -top-1 text-[10px] text-[var(--warning)]">℞</span>
              )}
            </div>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted-color)]">
              {dict.planets[p.planet]}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-[var(--text-primary-color)]">
              <SignGlyph sign={p.sign} size={13} className="text-[var(--gold)]" strokeWidth={2} />
              <span className="text-[11px] text-[var(--text-secondary-color)]">{p.degree}°</span>
            </p>
          </div>
        ))}
    </div>
  );
}
