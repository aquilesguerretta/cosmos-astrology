import type { ActiveTransit } from "@/lib/transits";
import { PLANET_GLYPHS } from "@/components/ui";

export function ActiveTransits({ transits }: { transits: ActiveTransit[] }) {
  return (
    <ul className="space-y-4">
      {transits.map((t) => (
        <li key={t.planet} className="flex gap-3">
          <span className="font-display mt-0.5 text-xl text-[var(--gold-light)]">{PLANET_GLYPHS[t.planet]}</span>
          <p className="text-sm leading-relaxed text-[var(--text-secondary-color)]">{t.text}</p>
        </li>
      ))}
    </ul>
  );
}
