"use client";

import { useEffect, useState } from "react";
import type { ZodiacSign } from "@/components/ui";
import type { HoroscopeContent } from "@/lib/ai";
import { AskTheStars } from "@/components/chart";
import { useI18n } from "@/components/i18n/I18nProvider";
import { ZodiacGrid } from "./ZodiacGrid";
import { ReadingPanel } from "./ReadingPanel";

function shiftISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ReadingClient({ userSign }: { userSign: ZodiacSign }) {
  const { locale, dict } = useI18n();
  const [selected, setSelected] = useState<ZodiacSign>(userSign);
  const [date, setDate] = useState<string>(todayISO);
  const [content, setContent] = useState<HoroscopeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/horoscope?sign=${selected}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setContent(d && !d.error ? (d as HoroscopeContent) : null);
        setLoading(false);
      })
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [selected, date, locale]);

  const [y, m, d] = date.split("-").map(Number);
  const dateLabel = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
    locale === "pt" ? "pt-BR" : "en-US",
    { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" },
  );

  const maxDate = shiftISO(todayISO(), 7);
  const canGoNext = date < maxDate;

  return (
    <>
      <ZodiacGrid selected={selected} userSign={userSign} onSelect={setSelected} />
      <div className="mt-12">
        <ReadingPanel
          sign={selected}
          dateLabel={dateLabel}
          content={content}
          loading={loading}
          canGoNext={canGoNext}
          onPrev={() => setDate((dd) => shiftISO(dd, -1))}
          onNext={() => canGoNext && setDate((dd) => shiftISO(dd, 1))}
        />
      </div>
      <AskTheStars context={`${dict.reading.askContext}: ${dict.zodiac.names[selected]} · ${date}`} />
    </>
  );
}
