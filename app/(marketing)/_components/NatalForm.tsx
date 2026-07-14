"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CityAutocomplete } from "@/components/geo/CityAutocomplete";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cityLabel, type City } from "@/lib/cities";
import { cn } from "@/lib/utils";

const FIELD =
  "group relative flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:border-[var(--gold)]/50 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_24px_rgba(201,168,76,0.15)]";
const FIELD_INPUT =
  "flex-1 bg-transparent text-sm tracking-wide text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]";

export function NatalForm() {
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.landing;

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);

  const ready = Boolean(date && city && (unknownTime || time));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || !city || loading) return;
    setLoading(true);
    try {
      await fetch("/api/natal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          date,
          time: unknownTime || !time ? "12:00" : time,
          lat: city.lat,
          lng: city.lng,
          timeZone: city.timeZone,
          location: cityLabel(city),
        }),
      });
      router.push("/chart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card glow className="mt-10 max-w-xl p-7">
      <div className="mb-5 flex items-center justify-between">
        <p className="label-caps">{t.natalInscription}</p>
        <span className="text-xs text-[var(--gold)]/60">✦ ✦ ✦</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block">
          <span className="label-caps mb-2 block">{t.yourName}</span>
          <div className={FIELD}>
            <User size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
            <input
              type="text"
              value={name}
              placeholder={t.namePlaceholder}
              onChange={(e) => setName(e.target.value)}
              className={FIELD_INPUT}
            />
          </div>
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-caps mb-2 block">{t.dateOfBirth}</span>
            <div className={FIELD}>
              <Calendar size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={FIELD_INPUT} />
            </div>
          </label>

          <label className="block">
            <span className="label-caps mb-2 block">{t.hourOfBirth}</span>
            <div className={cn(FIELD, unknownTime && "opacity-50")}>
              <Clock size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input type="time" value={time} disabled={unknownTime} onChange={(e) => setTime(e.target.value)} className={FIELD_INPUT} />
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setUnknownTime((v) => !v)}
          aria-pressed={unknownTime}
          className="mt-3 flex items-center gap-2.5 text-left"
        >
          <span
            className={cn(
              "grid h-4 w-4 place-items-center border transition",
              unknownTime
                ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold)]"
                : "border-[var(--gold)]/30 text-transparent",
            )}
          >
            <Check size={11} strokeWidth={2.5} />
          </span>
          <span className="text-[12px] tracking-wide text-[var(--text-secondary-color)]">{t.unknownTime}</span>
        </button>

        <div className="mt-4">
          <CityAutocomplete
            label={t.placeOfArrival}
            placeholder={t.cityPlaceholder}
            value={city}
            onChange={setCity}
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="max-w-[220px] text-[11px] leading-relaxed text-[var(--text-muted-color)]">{t.sealed}</p>
          <Button type="submit" loading={loading} disabled={!ready}>
            {t.reveal} <ArrowRight size={14} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
