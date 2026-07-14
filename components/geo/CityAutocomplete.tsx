"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cityLabel, type City } from "@/lib/cities";
import { cn } from "@/lib/utils";

const FIELD =
  "group relative flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:border-[var(--gold)]/50 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_24px_rgba(201,168,76,0.15)]";

interface CityAutocompleteProps {
  label: string;
  placeholder: string;
  value: City | null;
  onChange: (city: City | null) => void;
}

/** Debounced worldwide city search against /api/geocode (Open-Meteo).
 *  Works for any coordinates on Earth; falls back to an offline list. */
export function CityAutocomplete({ label, placeholder, value, onChange }: CityAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { results: City[] };
        setResults(data.results ?? []);
        setActive(-1);
      } catch {
        /* aborted or offline — keep previous results */
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => window.clearTimeout(t);
  }, [query]);

  function select(city: City) {
    onChange(city);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label className="block">
        <span className="label-caps mb-2 block">{label}</span>
        <div className={FIELD}>
          <MapPin size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
          <input
            type="text"
            value={value ? cityLabel(value) : query}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              onChange(null);
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm tracking-wide text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]"
          />
          {loading && <Loader2 size={14} className="animate-spin text-[var(--gold)]/60" />}
        </div>
      </label>

      {open && !value && results.length > 0 && (
        <ul className="glass-strong absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto py-1">
          {results.map((c, i) => (
            <li key={`${c.name}-${c.lat}-${c.lng}`}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(c);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition",
                  i === active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
                )}
              >
                <span className="min-w-0 truncate text-sm text-[var(--text-primary-color)]">
                  {c.name}
                  <span className="text-[var(--text-secondary-color)]">
                    {c.region ? `, ${c.region}` : ""}{c.country ? `, ${c.country}` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-[10px] tracking-wider text-[var(--text-muted-color)]">
                  {Math.abs(c.lat).toFixed(1)}°{c.lat >= 0 ? "N" : "S"} · {Math.abs(c.lng).toFixed(1)}°{c.lng >= 0 ? "E" : "W"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
