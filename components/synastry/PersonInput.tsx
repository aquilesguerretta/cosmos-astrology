"use client";

import { Calendar, Clock } from "lucide-react";
import { CityAutocomplete } from "@/components/geo/CityAutocomplete";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { City } from "@/lib/cities";

export interface Person {
  name: string;
  date: string;
  time: string;
  city: City | null;
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
  const { dict } = useI18n();
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
          placeholder={dict.synastry.namePlaceholder}
          className="min-w-0 flex-1 border-b border-transparent bg-transparent font-display text-2xl text-[var(--text-primary-color)] outline-none transition focus:border-[var(--gold)]/40 placeholder:text-[var(--text-muted-color)]"
        />
      </div>

      <label className="block">
        <span className="label-caps mb-2 block">{dict.synastry.date}</span>
        <div className={FIELD}>
          <Calendar size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
          <input type="date" value={value.date} onChange={(e) => set({ date: e.target.value })} className={INPUT} />
        </div>
      </label>

      <label className="block">
        <span className="label-caps mb-2 block">{dict.synastry.hour}</span>
        <div className={FIELD}>
          <Clock size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
          <input type="time" value={value.time} onChange={(e) => set({ time: e.target.value })} className={INPUT} />
        </div>
      </label>

      <CityAutocomplete
        label={dict.synastry.place}
        placeholder={dict.landing.cityPlaceholder}
        value={value.city}
        onChange={(city) => set({ city })}
      />
    </div>
  );
}
