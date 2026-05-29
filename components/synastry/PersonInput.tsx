"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { findCity, cityLabel } from "@/lib/cities";
import { cn } from "@/lib/utils";

export interface Person {
  name: string;
  date: string;
  time: string;
  cityName: string;
  lat: number;
  lng: number;
  utcOffset: number;
}

const FIELD =
  "group relative flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:border-[var(--gold)]/50 focus-within:bg-white/[0.04]";
const INPUT =
  "flex-1 bg-transparent text-sm tracking-wide text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]";

export function PersonInput({
  value,
  onChange,
  glyph,
}: {
  value: Person;
  onChange: (p: Person) => void;
  glyph: string;
}) {
  const [cityFocused, setCityFocused] = useState(false);
  const matches = findCity(value.cityName);
  const set = (patch: Partial<Person>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative">
          <div
            className="grid h-14 w-14 place-items-center rounded-full font-display text-2xl text-[var(--gold-light)]"
            style={{ background: "linear-gradient(135deg,#2D1B69,#1E3A5F)", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            {value.name.trim()[0]?.toUpperCase() ?? "?"}
          </div>
          <span
            className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-xs text-[#0A0A0F]"
            style={{ background: "linear-gradient(135deg,#E8C97A,#9A7A2E)" }}
          >
            {glyph}
          </span>
        </div>
        <input
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Name"
          className="flex-1 border-b border-transparent bg-transparent font-display text-2xl text-[var(--text-primary-color)] outline-none transition focus:border-[var(--gold)]/40 placeholder:text-[var(--text-muted-color)]"
        />
      </div>

      <label className="block">
        <span className="label-caps mb-2 block">Date of birth</span>
        <div className={FIELD}>
          <Calendar size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
          <input type="date" value={value.date} onChange={(e) => set({ date: e.target.value })} className={INPUT} />
        </div>
      </label>

      <label className="block">
        <span className="label-caps mb-2 block">Hour</span>
        <div className={FIELD}>
          <Clock size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
          <input type="time" value={value.time} onChange={(e) => set({ time: e.target.value })} className={INPUT} />
        </div>
      </label>

      <div className="relative">
        <label className="block">
          <span className="label-caps mb-2 block">Place</span>
          <div className={FIELD}>
            <MapPin size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
            <input
              type="text"
              value={value.cityName}
              placeholder="Lisbon, Portugal"
              autoComplete="off"
              onChange={(e) => set({ cityName: e.target.value })}
              onFocus={() => setCityFocused(true)}
              onBlur={() => window.setTimeout(() => setCityFocused(false), 150)}
              className={INPUT}
            />
          </div>
        </label>
        {cityFocused && matches.length > 0 && (
          <ul className="glass-strong absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto py-1">
            {matches.map((c) => (
              <li key={cityLabel(c)}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    set({ cityName: cityLabel(c), lat: c.lat, lng: c.lng, utcOffset: c.utcOffset });
                    setCityFocused(false);
                  }}
                  className={cn("w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary-color)] transition hover:bg-white/[0.03]")}
                >
                  {c.name}, <span className="text-[var(--text-secondary-color)]">{c.country}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
