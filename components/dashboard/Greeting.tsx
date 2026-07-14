"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

function SunMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" className="inline-block align-baseline text-[var(--gold-light)]" aria-hidden>
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = 12 + Math.cos(a) * 6.5;
        const y1 = 12 + Math.sin(a) * 6.5;
        const x2 = 12 + Math.cos(a) * 9.5;
        const y2 = 12 + Math.sin(a) * 9.5;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.9" opacity="0.85" />;
      })}
    </svg>
  );
}

function MoonMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block align-baseline text-[var(--gold-light)]" aria-hidden>
      <path
        d="M 15.5 3.5 A 9.2 9.2 0 1 0 20.5 15.5 A 7.4 7.4 0 0 1 15.5 3.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="7.5" cy="8" r="0.7" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="13.5" r="0.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function Greeting({ name }: { name: string }) {
  const { dict } = useI18n();
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);

  const word =
    hour === null
      ? dict.sanctum.welcome
      : hour >= 5 && hour < 12
        ? dict.sanctum.goodMorning
        : hour < 18
          ? dict.sanctum.goodAfternoon
          : dict.sanctum.goodEvening;
  const isDay = hour !== null && hour >= 5 && hour < 18;
  const first = (name || dict.common.traveler).split(" ")[0];

  return (
    <h1 className="font-display flex flex-wrap items-center gap-3 text-4xl md:text-5xl">
      <span>
        {word}, <em className="font-italic-display text-[var(--gold-light)]">{first}</em>
      </span>
      {hour === null ? (
        <span className="text-2xl text-[var(--gold)]/70">✦</span>
      ) : isDay ? (
        <SunMark />
      ) : (
        <MoonMark />
      )}
    </h1>
  );
}
