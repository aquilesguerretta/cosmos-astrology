"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Card, ZodiacIcon, ZODIAC_BY_KEY, type ZodiacSign } from "@/components/ui";
import { SIGN_MODALITY } from "@/lib/astrology";
import type { HoroscopeContent } from "@/lib/ai";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overall", label: "General" },
  { key: "love", label: "Love" },
  { key: "career", label: "Vocation" },
  { key: "health", label: "Health" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn("flex justify-between", !last && "border-b border-[var(--gold)]/10 pb-2")}>
      <span className="label-caps">{label}</span>
      <span>{value}</span>
    </div>
  );
}

interface ReadingPanelProps {
  sign: ZodiacSign;
  dateLabel: string;
  content: HoroscopeContent | null;
  loading: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function ReadingPanel({ sign, dateLabel, content, loading, canGoNext, onPrev, onNext }: ReadingPanelProps) {
  const [tab, setTab] = useState<TabKey>("overall");
  const z = ZODIAC_BY_KEY[sign];
  const rating = content?.rating ?? 0;

  function share() {
    const text = content ? `${z.name} — ${content.overall}` : `${z.name} · Cosmos`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: `Cosmos · ${z.name}`, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
    }
  }

  return (
    <Card glow className="p-8 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="glass flex items-center gap-1 px-2 py-1">
          <button onClick={onPrev} className="grid h-8 w-8 place-items-center text-[var(--text-secondary-color)] hover:text-[var(--gold-light)]" aria-label="Previous day"><ChevronLeft size={16} /></button>
          <span className="px-4 text-sm tracking-wide text-[var(--text-primary-color)]">{dateLabel}</span>
          <button onClick={onNext} disabled={!canGoNext} className="grid h-8 w-8 place-items-center text-[var(--text-secondary-color)] transition hover:text-[var(--gold-light)] disabled:opacity-30" aria-label="Next day"><ChevronRight size={16} /></button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className={i <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-[var(--gold)]/25"} />
            ))}
          </div>
          <button onClick={share} className="grid h-8 w-8 place-items-center text-[var(--text-secondary-color)] hover:text-[var(--gold-light)]" aria-label="Share"><Share2 size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <div>
          <div className="relative mx-auto grid h-44 w-44 place-items-center">
            <div className="absolute inset-0 rounded-full border border-[var(--gold)]/30" />
            <div className="absolute inset-3 rounded-full border border-[var(--gold)]/20" />
            <ZodiacIcon sign={sign} size={108} className="gold-text" />
          </div>
          <p className="mt-3 text-center font-display text-3xl">{z.name}</p>
          <p className="label-caps mt-1 text-center">{z.dates}</p>
          <div className="mt-6 space-y-2 text-xs text-[var(--text-secondary-color)]">
            <Row label="Element" value={z.element} />
            <Row label="Ruler" value={z.ruler} />
            <Row label="Modality" value={cap(SIGN_MODALITY[sign])} />
            {content && <Row label="Lucky №" value={String(content.luckyNumber)} />}
            {content && <Row label="Lucky color" value={content.luckyColor} last />}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "border px-4 py-2 text-xs uppercase tracking-widest transition",
                  tab === t.key
                    ? "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--gold)]"
                    : "border-[var(--gold)]/15 text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-8 space-y-3">
              <div className="h-4 w-3/4 animate-pulse bg-white/5" />
              <div className="h-4 w-full animate-pulse bg-white/5" />
              <div className="h-4 w-5/6 animate-pulse bg-white/5" />
            </div>
          ) : (
            <p className="mt-8 leading-[1.8] text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "18px" }}>
              {content?.[tab]}
            </p>
          )}

          {content && (
            <p className="mt-8 border-t border-[var(--gold)]/15 pt-6 italic text-[var(--gold-light)]" style={{ fontFamily: "var(--font-display)", fontSize: "19px" }}>
              &ldquo;{content.affirmation}&rdquo;
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
