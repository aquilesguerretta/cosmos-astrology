"use client";

import { useState } from "react";
import { Sparkles, Layers, Hand } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { FULL_DECK, type TarotCard } from "@/lib/tarot/deck";
import { SPREADS, type SpreadId } from "@/lib/tarot/spreads";
import { FlipCard } from "./FlipCard";
import { TarotCardArt } from "./TarotCardArt";
import { CardPicker, type PickedCard } from "./CardPicker";
import { cn } from "@/lib/utils";

type Mode = "draw" | "physical";

interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
  revealed: boolean;
}

function shuffleDraw(n: number): DrawnCard[] {
  const deck = [...FULL_DECK];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n).map((card) => ({
    card,
    reversed: Math.random() < 0.33,
    revealed: false,
  }));
}

export function TarotClient() {
  const { locale, dict } = useI18n();
  const t = dict.tarot;

  const [mode, setMode] = useState<Mode>("draw");
  const [spreadId, setSpreadId] = useState<SpreadId>("three");
  const [question, setQuestion] = useState("");
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [picks, setPicks] = useState<(PickedCard | null)[]>([]);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const spread = SPREADS[spreadId];
  const spreadName =
    spreadId === "single" ? t.spreadSingle : spreadId === "three" ? t.spreadThree : t.spreadCross;

  function selectSpread(id: SpreadId) {
    setSpreadId(id);
    setDrawn(null);
    setPicks(Array.from({ length: SPREADS[id].positions.length }, () => null));
    setReading("");
  }

  function draw() {
    setDrawn(shuffleDraw(spread.positions.length));
    setReading("");
  }

  const allRevealed = drawn !== null && drawn.every((d) => d.revealed);
  const allPicked = picks.length === spread.positions.length && picks.every(Boolean);

  async function interpret() {
    const source =
      mode === "draw"
        ? drawn?.map((d, i) => ({ id: d.card.id, position: spread.positions[i].name[locale], reversed: d.reversed }))
        : picks.map((p, i) => ({ id: p!.card.id, position: spread.positions[i].name[locale], reversed: p!.reversed }));
    if (!source) return;
    setLoading(true);
    setReading("");
    try {
      const res = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() || undefined, spread: spreadName, cards: source }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setReading((r) => r + dec.decode(value, { stream: true }));
      }
    } finally {
      setLoading(false);
    }
  }

  const SPREAD_OPTIONS: { id: SpreadId; name: string; desc: string; count: number }[] = [
    { id: "single", name: t.spreadSingle, desc: t.spreadSingleDesc, count: 1 },
    { id: "three", name: t.spreadThree, desc: t.spreadThreeDesc, count: 3 },
    { id: "cross", name: t.spreadCross, desc: t.spreadCrossDesc, count: 10 },
  ];

  return (
    <>
      {/* mode toggle */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: "draw", label: t.digitalMode, icon: Layers },
          { key: "physical", label: t.physicalMode, icon: Hand },
        ] as const).map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => {
                setMode(m.key);
                setReading("");
              }}
              className={cn(
                "flex items-center gap-2 border px-4 py-2.5 text-xs uppercase tracking-widest transition",
                mode === m.key
                  ? "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--gold)]"
                  : "border-[var(--gold)]/15 text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]",
              )}
            >
              <Icon size={13} /> {m.label}
            </button>
          );
        })}
      </div>

      {/* spread selector */}
      <div className="mt-6">
        <p className="label-caps mb-3">{t.chooseSpread}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SPREAD_OPTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => selectSpread(s.id)}
              className={cn(
                "border p-4 text-left transition-all duration-300",
                spreadId === s.id
                  ? "border-[var(--gold)]/60 bg-gradient-to-br from-[var(--purple-deep)]/30 to-transparent shadow-[0_0_24px_rgba(201,168,76,0.15)]"
                  : "border-[var(--gold)]/12 hover:-translate-y-0.5 hover:border-[var(--gold)]/30",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-xl text-[var(--text-primary-color)]">{s.name}</p>
                <span className="font-display text-2xl text-[var(--gold)]/60">{s.count}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary-color)]">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* question */}
      <div className="mt-6">
        <label className="block">
          <span className="label-caps mb-2 block">{t.question}</span>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.questionPlaceholder}
            className="w-full border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3.5 text-[15px] italic text-[var(--text-primary-color)] outline-none transition focus:border-[var(--gold)]/50 placeholder:text-[var(--text-muted-color)]"
            style={{ fontFamily: "var(--font-display)" }}
          />
        </label>
        <p className="mt-2 text-[11px] tracking-wide text-[var(--gold)]/70">✦ {t.honestyNote}</p>
      </div>

      {/* ── DRAW MODE ── */}
      {mode === "draw" && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={draw}>
              {drawn ? t.drawAgain : t.shuffleDraw} <Layers size={13} />
            </Button>
            {drawn && !allRevealed && (
              <>
                <Button variant="ghost" onClick={() => setDrawn(drawn.map((d) => ({ ...d, revealed: true })))}>
                  {t.revealAll}
                </Button>
                <span className="text-xs italic text-[var(--text-muted-color)]" style={{ fontFamily: "var(--font-display)" }}>
                  {t.tapToReveal}
                </span>
              </>
            )}
          </div>

          {drawn && (
            <div className={cn("mt-8 grid justify-items-center gap-x-4 gap-y-6", spreadId === "cross" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-3 max-w-xl")}>
              {drawn.map((d, i) => (
                <div key={`${d.card.id}-${i}`} className="flex flex-col items-center gap-2.5">
                  <FlipCard
                    card={d.card}
                    reversed={d.reversed}
                    revealed={d.revealed}
                    width={spreadId === "cross" ? 118 : 138}
                    onReveal={() => setDrawn((cur) => cur!.map((x, xi) => (xi === i ? { ...x, revealed: true } : x)))}
                  />
                  <p className="label-caps max-w-[140px] text-center text-[10px] leading-snug">
                    {spread.positions[i].name[locale]}
                  </p>
                  {d.revealed && d.reversed && (
                    <span className="border border-[var(--warning)]/50 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-[var(--warning)]">
                      {t.reversed}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {allRevealed && (
            <div className="mt-8">
              <Button onClick={interpret} loading={loading}>
                {t.interpret} <Sparkles size={13} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── PHYSICAL MODE ── */}
      {mode === "physical" && (
        <div className="mt-8">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary-color)]">{t.physicalHint}</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spread.positions.map((pos, i) => (
              <CardPicker
                key={pos.id}
                label={`${i + 1} · ${pos.name[locale]}`}
                value={picks[i] ?? null}
                onChange={(v) => setPicks((cur) => cur.map((x, xi) => (xi === i ? v : x)))}
                usedIds={picks.filter(Boolean).map((p) => p!.card.id)}
              />
            ))}
          </div>

          {allPicked && (
            <div className="mt-8 flex flex-wrap items-end gap-4">
              {picks.map((p, i) => (
                <div key={p!.card.id} className="flex flex-col items-center gap-2">
                  <TarotCardArt card={p!.card} reversed={p!.reversed} width={92} />
                  <p className="label-caps max-w-[100px] text-center text-[9px] leading-snug">
                    {spread.positions[i].name[locale]}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button onClick={interpret} loading={loading} disabled={!allPicked}>
              {t.interpret} <Sparkles size={13} />
            </Button>
            <Button variant="ghost" onClick={() => setPicks(spread.positions.map(() => null))}>
              {t.clearSpread}
            </Button>
          </div>
        </div>
      )}

      {/* ── READING ── */}
      {(reading || loading) && (
        <Card glow className="mt-10 p-7 md:p-9">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles size={14} className="text-[var(--gold)]" />
            <p className="label-caps">{t.interpretation}</p>
          </div>
          <p
            className="whitespace-pre-line leading-[1.85] text-[var(--text-secondary-color)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17.5px" }}
          >
            {reading}
            {loading && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[var(--gold)]/60 align-middle" />}
          </p>
        </Card>
      )}
    </>
  );
}
