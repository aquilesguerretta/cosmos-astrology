"use client";

import type { SynastryAspect } from "@/lib/astrology/synastry";
import type { Planet } from "@/lib/astrology";
import { Card, PlanetSymbol } from "@/components/ui";
import { ASPECT_META } from "@/components/chart";
import { useI18n } from "@/components/i18n/I18nProvider";

const PERSONAL: Planet[] = ["sun", "moon", "mercury", "venus", "mars"];

export function SynastryAspects({ aspects }: { aspects: SynastryAspect[] }) {
  const { dict } = useI18n();
  const top = aspects
    .filter((a) => PERSONAL.includes(a.planetA) && PERSONAL.includes(a.planetB))
    .slice(0, 6);
  const list = top.length ? top : aspects.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {list.map((a, i) => {
        const meta = ASPECT_META[a.type];
        return (
          <Card key={`${a.planetA}-${a.planetB}-${i}`} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[var(--gold-light)]">
                <PlanetSymbol planet={a.planetA} size={21} strokeWidth={1.7} />
                <span className="font-display text-xl" style={{ color: meta.color }}>{meta.symbol}</span>
                <PlanetSymbol planet={a.planetB} size={21} strokeWidth={1.7} />
              </span>
              <span
                className="border px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: meta.color, borderColor: `${meta.color}55` }}
              >
                {dict.aspects[a.type]}
              </span>
            </div>
            <p className="font-display text-xl text-[var(--text-primary-color)]">
              {dict.planets[a.planetA]} {dict.aspects[a.type].toLowerCase()} {dict.planets[a.planetB]}
            </p>
            <div className="mt-4 h-[3px] bg-white/5">
              <div className="h-full" style={{ width: `${Math.max(8, 100 - a.orb * 12)}%`, background: meta.color }} />
            </div>
            <p className="mt-1.5 text-xs tracking-widest text-[var(--text-muted-color)]">{dict.common.orb} {a.orb}°</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary-color)]">
              {a.isHarmonious ? dict.synastry.harmonicNote : dict.synastry.tenseNote}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
