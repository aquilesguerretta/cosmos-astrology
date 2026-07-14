"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Card, ZodiacIcon, PlanetSymbol, ZODIAC_BY_KEY } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { SIGN_ENTRIES, PLANET_ENTRIES, HOUSE_ENTRIES, ASPECT_ENTRIES } from "@/lib/knowledge/astro";
import { FULL_DECK, SUIT_INFO, NUMBER_THEMES, RANK_THEMES, type TarotCard } from "@/lib/tarot/deck";
import { TarotCardArt } from "@/components/tarot";
import { ASPECT_META } from "@/components/chart";
import { SIGN_ELEMENT, SIGN_MODALITY } from "@/lib/astrology";
import { cn } from "@/lib/utils";

type Tab = "signs" | "planets" | "houses" | "aspects" | "tarot";
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function Row({
  head,
  sub,
  open,
  onToggle,
  children,
}: {
  head: React.ReactNode;
  sub?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
        <span className="flex min-w-0 flex-1 items-center gap-4">{head}</span>
        {sub && <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted-color)] md:block">{sub}</span>}
        <ChevronDown size={15} className={cn("shrink-0 text-[var(--gold)]/60 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="animate-fade-up border-t border-[var(--gold)]/10 p-4 sm:p-5">{children}</div>}
    </Card>
  );
}

function Keywords({ label, words, tone }: { label: string; words: string[]; tone?: "warn" }) {
  return (
    <div>
      <p className={cn("label-caps mb-1.5", tone === "warn" ? "text-[var(--warning)]" : "text-[var(--gold)]/80")}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {words.map((w) => (
          <span key={w} className="border border-[var(--gold)]/20 px-2 py-0.5 text-[11px] tracking-wide text-[var(--text-secondary-color)]">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LibraryClient() {
  const { locale, dict } = useI18n();
  const t = dict.library;
  const [tab, setTab] = useState<Tab>("signs");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const matches = (...texts: string[]) => !q || texts.some((x) => x.toLowerCase().includes(q));
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const TABS: { key: Tab; label: string }[] = [
    { key: "signs", label: t.tabSigns },
    { key: "planets", label: t.tabPlanets },
    { key: "houses", label: t.tabHouses },
    { key: "aspects", label: t.tabAspects },
    { key: "tarot", label: t.tabTarot },
  ];

  const tarotFiltered = useMemo(
    () => FULL_DECK.filter((c) => matches(c.name[locale], c.keywords[locale].up.join(" "))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, locale],
  );

  const renderTarotCardRow = (c: TarotCard) => (
    <Row
      key={c.id}
      open={openId === c.id}
      onToggle={() => toggle(c.id)}
      head={
        <>
          <span className="font-display w-8 text-center text-lg text-[var(--gold-light)]">
            {c.arcana === "major" ? "✦" : c.number}
          </span>
          <span className="font-display truncate text-lg text-[var(--text-primary-color)]">{c.name[locale]}</span>
        </>
      }
      sub={c.arcana === "major" ? t.majorArcana : SUIT_INFO[c.suit!].domain[locale]}
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="shrink-0"><TarotCardArt card={c} width={120} /></div>
        <div className="min-w-0 flex-1 space-y-4">
          {c.essence && (
            <p className="italic leading-relaxed text-[var(--gold-light)]" style={{ fontFamily: "var(--font-display)", fontSize: "17px" }}>
              {c.essence[locale]}
            </p>
          )}
          <Keywords label={t.uprightShort} words={c.keywords[locale].up} />
          <Keywords label={t.reversedShort} words={c.keywords[locale].rev} tone="warn" />
          {c.suit && (
            <p className="text-xs text-[var(--text-muted-color)]">
              {SUIT_INFO[c.suit].name[locale]} · {SUIT_INFO[c.suit].element[locale]} — {SUIT_INFO[c.suit].domain[locale]}
            </p>
          )}
        </div>
      </div>
    </Row>
  );

  return (
    <>
      {/* tabs + search */}
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => { setTab(tb.key); setOpenId(null); }}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-widest transition",
              tab === tb.key
                ? "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--gold)]"
                : "border-[var(--gold)]/15 text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]",
            )}
          >
            {tb.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex max-w-md items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3 transition focus-within:border-[var(--gold)]/50">
        <Search size={14} className="text-[var(--gold)]/60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]"
        />
      </div>

      <div className="mt-8 space-y-3">
        {/* SIGNS */}
        {tab === "signs" &&
          SIGN_ENTRIES.filter((s) => matches(dict.zodiac.names[s.sign], s.keywords[locale].join(" "))).map((s) => (
            <Row
              key={s.sign}
              open={openId === s.sign}
              onToggle={() => toggle(s.sign)}
              head={
                <>
                  <ZodiacIcon sign={s.sign} size={26} className="text-[var(--gold-light)]" />
                  <span className="font-display text-lg text-[var(--text-primary-color)]">{dict.zodiac.names[s.sign]}</span>
                </>
              }
              sub={`${dict.elements[SIGN_ELEMENT[s.sign]]} · ${dict.modalities[SIGN_MODALITY[s.sign]]} · ${ZODIAC_BY_KEY[s.sign].ruler}`}
            >
              <div className="space-y-4">
                <p className="leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
                  {s.desc[locale]}
                </p>
                <Keywords label={t.keywords} words={s.keywords[locale]} />
                <p className="text-xs text-[var(--text-muted-color)]">{dict.zodiac.dates[s.sign]}</p>
              </div>
            </Row>
          ))}

        {/* PLANETS */}
        {tab === "planets" &&
          PLANET_ENTRIES.filter((p) => matches(dict.planets[p.planet], p.keywords[locale].join(" "))).map((p) => (
            <Row
              key={p.planet}
              open={openId === p.planet}
              onToggle={() => toggle(p.planet)}
              head={
                <>
                  <span className="flex w-8 justify-center text-[var(--gold-light)]">
                    <PlanetSymbol planet={p.planet} size={22} strokeWidth={1.6} />
                  </span>
                  <span className="font-display text-lg text-[var(--text-primary-color)]">{dict.planets[p.planet]}</span>
                </>
              }
            >
              <div className="space-y-4">
                <p className="leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
                  {p.desc[locale]}
                </p>
                <Keywords label={t.keywords} words={p.keywords[locale]} />
              </div>
            </Row>
          ))}

        {/* HOUSES */}
        {tab === "houses" &&
          HOUSE_ENTRIES.filter((h) => matches(h.title[locale], h.keywords[locale].join(" "))).map((h) => (
            <Row
              key={h.house}
              open={openId === `h${h.house}`}
              onToggle={() => toggle(`h${h.house}`)}
              head={
                <>
                  <span className="font-display w-8 text-center text-base text-[var(--gold-light)]">{ROMAN[h.house - 1]}</span>
                  <span className="font-display text-lg text-[var(--text-primary-color)]">{h.title[locale]}</span>
                </>
              }
              sub={`${t.house} ${h.house}`}
            >
              <div className="space-y-4">
                <p className="leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
                  {h.desc[locale]}
                </p>
                <Keywords label={t.keywords} words={h.keywords[locale]} />
              </div>
            </Row>
          ))}

        {/* ASPECTS */}
        {tab === "aspects" &&
          ASPECT_ENTRIES.filter((a) => matches(dict.aspects[a.type])).map((a) => (
            <Row
              key={a.type}
              open={openId === a.type}
              onToggle={() => toggle(a.type)}
              head={
                <>
                  <span className="w-8 text-center text-xl" style={{ color: ASPECT_META[a.type].color }}>
                    {ASPECT_META[a.type].symbol}
                  </span>
                  <span className="font-display text-lg text-[var(--text-primary-color)]">{dict.aspects[a.type]}</span>
                </>
              }
              sub={`${a.angle}° · ${t.orb} ±${a.orb}°`}
            >
              <div className="space-y-4">
                <p className="leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
                  {a.desc[locale]}
                </p>
                <p className="text-xs text-[var(--text-muted-color)]">
                  {t.nature}:{" "}
                  {a.nature === "harmonious" ? t.natureHarmonious : a.nature === "tense" ? t.natureTense : t.natureNeutral}
                </p>
              </div>
            </Row>
          ))}

        {/* TAROT */}
        {tab === "tarot" && (
          <>
            {!q && (
              <Card className="p-5 sm:p-6">
                <p className="label-caps mb-4">{t.suitTheory}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(Object.keys(SUIT_INFO) as (keyof typeof SUIT_INFO)[]).map((s) => (
                    <div key={s} className="border border-[var(--gold)]/12 bg-white/[0.02] p-4">
                      <p className="font-display text-lg text-[var(--gold-light)]">{SUIT_INFO[s].name[locale]}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">{SUIT_INFO[s].element[locale]}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary-color)]">{SUIT_INFO[s].domain[locale]}</p>
                    </div>
                  ))}
                </div>
                <p className="label-caps mb-3 mt-8">{t.numberTheory}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {Object.entries(NUMBER_THEMES).map(([n, th]) => (
                    <p key={n} className="text-xs text-[var(--text-secondary-color)]">
                      <span className="font-display mr-2 text-[var(--gold-light)]">{th.label[locale]}</span>
                      {(locale === "pt" ? th.upPt : th.upEn).join(" · ")}
                    </p>
                  ))}
                </div>
                <p className="label-caps mb-3 mt-8">{t.courtTheory}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(RANK_THEMES).map(([n, th]) => (
                    <p key={n} className="text-xs text-[var(--text-secondary-color)]">
                      <span className="font-display mr-2 text-[var(--gold-light)]">{th.label[locale]}</span>
                      {(locale === "pt" ? th.upPt : th.upEn).join(" · ")}
                    </p>
                  ))}
                </div>
              </Card>
            )}
            {tarotFiltered.map(renderTarotCardRow)}
          </>
        )}

        {((tab === "signs" && !SIGN_ENTRIES.some((s) => matches(dict.zodiac.names[s.sign], s.keywords[locale].join(" ")))) ||
          (tab === "tarot" && tarotFiltered.length === 0)) && (
          <p className="py-8 text-center text-sm text-[var(--text-muted-color)]">{t.empty}</p>
        )}
      </div>
    </>
  );
}
