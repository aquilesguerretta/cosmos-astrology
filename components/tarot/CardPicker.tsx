"use client";

import { useMemo, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { FULL_DECK, type TarotCard } from "@/lib/tarot/deck";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export interface PickedCard {
  card: TarotCard;
  reversed: boolean;
}

interface CardPickerProps {
  label: string;
  value: PickedCard | null;
  onChange: (v: PickedCard | null) => void;
  /** Card ids already used in other positions (hidden from the list). */
  usedIds: string[];
}

/** Searchable selector over the 78 cards + reversed toggle — used to recreate
 *  a physical spread. */
export function CardPicker({ label, value, onChange, usedIds }: CardPickerProps) {
  const { locale, dict } = useI18n();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = FULL_DECK.filter((c) => !usedIds.includes(c.id) || c.id === value?.card.id);
    if (!q) return pool.slice(0, 10);
    return pool.filter((c) => c.name[locale].toLowerCase().includes(q)).slice(0, 10);
  }, [query, locale, usedIds, value]);

  return (
    <div className="relative">
      <span className="label-caps mb-2 block">{label}</span>

      {value ? (
        <div className="flex items-center gap-2 border border-[var(--gold)]/25 bg-white/[0.03] px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-primary-color)]">
            {value.card.name[locale]}
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...value, reversed: !value.reversed })}
            className={cn(
              "flex items-center gap-1 border px-2 py-1 text-[10px] uppercase tracking-widest transition",
              value.reversed
                ? "border-[var(--warning)]/60 text-[var(--warning)]"
                : "border-[var(--gold)]/25 text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]",
            )}
            title={dict.tarot.reversed}
          >
            <RotateCcw size={10} />
            {value.reversed ? dict.tarot.reversed : dict.tarot.upright}
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[var(--text-muted-color)] transition hover:text-[var(--error)]"
            aria-label="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          placeholder={dict.tarot.searchCard}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          className="w-full border border-[var(--gold)]/15 bg-white/[0.025] px-3 py-2.5 text-sm text-[var(--text-primary-color)] outline-none transition focus:border-[var(--gold)]/50 placeholder:text-[var(--text-muted-color)]"
        />
      )}

      {open && !value && results.length > 0 && (
        <ul className="glass-strong absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto py-1">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange({ card: c, reversed: false });
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-[var(--text-primary-color)] transition hover:bg-white/[0.04]"
              >
                <span className="truncate">{c.name[locale]}</span>
                <span className="shrink-0 text-[9px] uppercase tracking-widest text-[var(--text-muted-color)]">
                  {c.arcana === "major" ? dict.library.majorArcana : dict.library.minorArcana}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
