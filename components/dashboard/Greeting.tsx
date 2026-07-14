"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

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
  const glyph = hour === null ? "✦" : hour >= 5 && hour < 18 ? "☀️" : "🌙";
  const first = (name || dict.common.traveler).split(" ")[0];

  return (
    <h1 className="font-display text-4xl md:text-5xl">
      {word}, <em className="font-italic-display text-[var(--gold-light)]">{first}</em>{" "}
      <span className="text-2xl">{glyph}</span>
    </h1>
  );
}
