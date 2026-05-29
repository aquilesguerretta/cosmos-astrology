import type { MoonPhaseInfo } from "@/lib/transits";

/** Moon disc with an elliptical terminator sized by the phase angle. */
function MoonDisc({ angle, size = 64 }: { angle: number; size?: number }) {
  const r = size / 2 - 2;
  const rx = Math.abs(Math.cos((angle * Math.PI) / 180)) * r;
  const waxing = angle <= 180; // lit on the right while waxing
  const gibbous = angle > 90 && angle < 270;
  const outerSweep = waxing ? 1 : 0;
  const termSweep = waxing ? (gibbous ? 1 : 0) : gibbous ? 0 : 1;
  const lit = `M 0 ${-r} A ${r} ${r} 0 0 ${outerSweep} 0 ${r} A ${rx} ${r} 0 0 ${termSweep} 0 ${-r} Z`;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <circle r={r} fill="#16161f" stroke="rgba(201,168,76,0.3)" strokeWidth="0.6" />
      <path d={lit} fill="#E8C97A" opacity="0.9" />
    </svg>
  );
}

export function MoonPhase({ info, size = 64 }: { info: MoonPhaseInfo; size?: number }) {
  return (
    <div className="flex items-center gap-4">
      <MoonDisc angle={info.angle} size={size} />
      <div className="min-w-0">
        <p className="font-display text-lg text-[var(--text-primary-color)]">{info.name}</p>
        <p className="text-xs text-[var(--text-secondary-color)]">{Math.round(info.illumination * 100)}% illuminated</p>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-[var(--text-muted-color)]">
          Full moon in {info.daysToFull} days
        </p>
      </div>
    </div>
  );
}
