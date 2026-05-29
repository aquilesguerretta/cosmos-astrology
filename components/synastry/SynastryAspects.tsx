import type { SynastryAspect } from "@/lib/astrology/synastry";
import type { Planet } from "@/lib/astrology";
import { Card, PLANET_GLYPHS, PLANET_NAMES } from "@/components/ui";
import { ASPECT_META } from "@/components/chart";

const PERSONAL: Planet[] = ["sun", "moon", "mercury", "venus", "mars"];

export function SynastryAspects({ aspects }: { aspects: SynastryAspect[] }) {
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
              <span className="font-display text-2xl text-[var(--gold-light)]">
                {PLANET_GLYPHS[a.planetA]} {meta.symbol} {PLANET_GLYPHS[a.planetB]}
              </span>
              <span
                className="border px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: meta.color, borderColor: `${meta.color}55` }}
              >
                {meta.label}
              </span>
            </div>
            <p className="font-display text-xl text-[var(--text-primary-color)]">
              {PLANET_NAMES[a.planetA]} {meta.label.toLowerCase()} {PLANET_NAMES[a.planetB]}
            </p>
            <div className="mt-4 h-[3px] bg-white/5">
              <div className="h-full" style={{ width: `${Math.max(8, 100 - a.orb * 12)}%`, background: meta.color }} />
            </div>
            <p className="mt-1.5 text-xs tracking-widest text-[var(--text-muted-color)]">orb {a.orb}°</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary-color)]">
              {a.isHarmonious
                ? "A current that flows with little resistance between you."
                : "A productive friction — name it, and it builds rather than burns."}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
