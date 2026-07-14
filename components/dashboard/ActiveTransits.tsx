"use client";

import type { ActiveTransit } from "@/lib/transits";
import { PLANET_GLYPHS } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";

export function ActiveTransits({ transits }: { transits: ActiveTransit[] }) {
  const { dict } = useI18n();
  return (
    <ul className="space-y-4">
      {transits.map((t) => {
        const text = dict.transits.template
          .replace("{planet}", dict.planets[t.planet])
          .replace("{house}", String(t.house))
          .replace("{theme}", dict.transits.houses[t.house]);
        return (
          <li key={t.planet} className="flex gap-3">
            <span className="font-display mt-0.5 text-xl text-[var(--gold-light)]">{PLANET_GLYPHS[t.planet]}</span>
            <p className="text-sm leading-relaxed text-[var(--text-secondary-color)]">{text}</p>
          </li>
        );
      })}
    </ul>
  );
}
