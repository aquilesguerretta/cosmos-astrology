"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CitySuggestion {
  name: string;
  country: string;
  coord: string;
}

// Static suggestions — visual only. Real geocoding (OpenCage) arrives later.
const CITIES: CitySuggestion[] = [
  { name: "Lisbon", country: "Portugal", coord: "38.72°N · 9.13°W" },
  { name: "Marseille", country: "France", coord: "43.30°N · 5.37°E" },
  { name: "Paris", country: "France", coord: "48.86°N · 2.35°E" },
  { name: "London", country: "United Kingdom", coord: "51.51°N · 0.13°W" },
  { name: "Madrid", country: "Spain", coord: "40.42°N · 3.70°W" },
  { name: "Rome", country: "Italy", coord: "41.90°N · 12.50°E" },
  { name: "New York", country: "United States", coord: "40.71°N · 74.01°W" },
  { name: "Rio de Janeiro", country: "Brazil", coord: "22.91°S · 43.17°W" },
  { name: "São Paulo", country: "Brazil", coord: "23.55°S · 46.63°W" },
  { name: "Tokyo", country: "Japan", coord: "35.68°N · 139.65°E" },
  { name: "Cairo", country: "Egypt", coord: "30.04°N · 31.24°E" },
  { name: "Mumbai", country: "India", coord: "19.08°N · 72.88°E" },
];

const FIELD =
  "group relative flex items-center gap-3 border bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_24px_rgba(201,168,76,0.15)] border-[var(--gold)]/15 focus-within:border-[var(--gold)]/50";
const FIELD_INPUT =
  "flex-1 bg-transparent text-sm tracking-wide text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]";

export function NatalForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [city, setCity] = useState("");
  const [cityFocused, setCityFocused] = useState(false);

  const query = city.trim().toLowerCase();
  const matches = (
    query.length > 0
      ? CITIES.filter((c) => c.name.toLowerCase().includes(query))
      : CITIES
  ).slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual flow only — birth-data persistence arrives with auth (Prompt 9).
    router.push("/chart");
  };

  return (
    <Card glow className="mt-10 max-w-xl p-7">
      <div className="mb-5 flex items-center justify-between">
        <p className="label-caps">Natal Inscription</p>
        <span className="text-xs text-[var(--gold)]/60">✦ ✦ ✦</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Date */}
          <label className="block">
            <span className="label-caps mb-2 block">Date of birth</span>
            <div className={FIELD}>
              <Calendar size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={FIELD_INPUT}
              />
            </div>
          </label>

          {/* Time */}
          <label className="block">
            <span className="label-caps mb-2 block">Hour of birth</span>
            <div className={cn(FIELD, unknownTime && "opacity-50")}>
              <Clock size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input
                type="time"
                value={time}
                disabled={unknownTime}
                onChange={(e) => setTime(e.target.value)}
                className={FIELD_INPUT}
              />
            </div>
          </label>
        </div>

        {/* "don't know my time" checkbox */}
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
          <span className="text-[12px] tracking-wide text-[var(--text-secondary-color)]">
            I don&apos;t know my exact time of birth
          </span>
        </button>

        {/* City autocomplete (visual only) */}
        <div className="relative mt-4">
          <label className="block">
            <span className="label-caps mb-2 block">Place of arrival</span>
            <div className={FIELD}>
              <MapPin size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input
                type="text"
                value={city}
                placeholder="Lisbon, Portugal"
                autoComplete="off"
                onChange={(e) => setCity(e.target.value)}
                onFocus={() => setCityFocused(true)}
                onBlur={() => window.setTimeout(() => setCityFocused(false), 150)}
                className={FIELD_INPUT}
              />
            </div>
          </label>

          {cityFocused && matches.length > 0 && (
            <ul className="glass-strong absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto py-1">
              {matches.map((c) => (
                <li key={`${c.name}-${c.country}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setCity(`${c.name}, ${c.country}`);
                      setCityFocused(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition hover:bg-white/[0.03]"
                  >
                    <span className="text-sm text-[var(--text-primary-color)]">
                      {c.name},{" "}
                      <span className="text-[var(--text-secondary-color)]">{c.country}</span>
                    </span>
                    <span className="text-[10px] tracking-wider text-[var(--text-muted-color)]">
                      {c.coord}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="max-w-[220px] text-[11px] leading-relaxed text-[var(--text-muted-color)]">
            Coordinates honored to the arcminute. Your data remains sealed.
          </p>
          <Button type="submit">
            Reveal My Chart <ArrowRight size={14} />
          </Button>
        </div>
      </form>
    </Card>
  );
}
