"use client";

import type { MoonPhaseInfo, MoonPhaseKey } from "@/lib/transits";
import { useI18n } from "@/components/i18n/I18nProvider";

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

const NAME_KEY: Record<MoonPhaseKey, MoonPhaseKey> = {
  newMoon: "newMoon",
  waxingCrescent: "waxingCrescent",
  firstQuarter: "firstQuarter",
  waxingGibbous: "waxingGibbous",
  fullMoon: "fullMoon",
  waningGibbous: "waningGibbous",
  lastQuarter: "lastQuarter",
  waningCrescent: "waningCrescent",
};

const DESC_KEY: Record<MoonPhaseKey, "descNew" | "descWaxingCrescent" | "descFirstQuarter" | "descWaxingGibbous" | "descFull" | "descWaningGibbous" | "descLastQuarter" | "descWaningCrescent"> = {
  newMoon: "descNew",
  waxingCrescent: "descWaxingCrescent",
  firstQuarter: "descFirstQuarter",
  waxingGibbous: "descWaxingGibbous",
  fullMoon: "descFull",
  waningGibbous: "descWaningGibbous",
  lastQuarter: "descLastQuarter",
  waningCrescent: "descWaningCrescent",
};

export function moonPhaseDescription(
  info: MoonPhaseInfo,
  moonDict: { [k: string]: string },
): string {
  return moonDict[DESC_KEY[info.phaseKey]];
}

export function MoonPhase({ info, size = 64 }: { info: MoonPhaseInfo; size?: number }) {
  const { dict } = useI18n();
  return (
    <div className="flex items-center gap-4">
      <MoonDisc angle={info.angle} size={size} />
      <div className="min-w-0">
        <p className="font-display text-lg text-[var(--text-primary-color)]">
          {dict.moon[NAME_KEY[info.phaseKey]]}
        </p>
        <p className="text-xs text-[var(--text-secondary-color)]">
          {Math.round(info.illumination * 100)}% {dict.moon.illuminated}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-[var(--text-muted-color)]">
          {dict.moon.fullMoonIn.replace("{n}", String(info.daysToFull))}
        </p>
      </div>
    </div>
  );
}

export function MoonPhaseDescription({ info }: { info: MoonPhaseInfo }) {
  const { dict } = useI18n();
  return (
    <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary-color)]">
      {dict.moon[DESC_KEY[info.phaseKey]]}
    </p>
  );
}
