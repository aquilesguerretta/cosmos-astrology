"use client";

import { useState } from "react";
import { Sparkles, Layers, Hand, Send, CornerDownRight } from "lucide-react";
import { Card, Button, AiProse } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { FULL_DECK, type TarotCard } from "@/lib/tarot/deck";
import { SPREADS, type SpreadId } from "@/lib/tarot/spreads";
import { FlipCard } from "./FlipCard";
import { TarotCardArt } from "./TarotCardArt";
import { CardPicker, type PickedCard } from "./CardPicker";
import { cn } from "@/lib/utils";

type Mode = "draw" | "physical";
type ChatMsg = { role: "user" | "assistant"; content: string };
type CardRef = { id: string; position: string; reversed: boolean };

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
  const [thread, setThread] = useState<ChatMsg[]>([]);
  const [chatting, setChatting] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [activeCards, setActiveCards] = useState<CardRef[] | null>(null);

  const spread = SPREADS[spreadId];
  const spreadName =
    spreadId === "single" ? t.spreadSingle : spreadId === "three" ? t.spreadThree : t.spreadCross;
  const initialLoading = chatting && thread.length === 1;

  function resetReading() {
    setThread([]);
    setFollowUp("");
    setActiveCards(null);
  }

  function selectSpread(id: SpreadId) {
    setSpreadId(id);
    setDrawn(null);
    setPicks(Array.from({ length: SPREADS[id].positions.length }, () => null));
    resetReading();
  }

  function draw() {
    setDrawn(shuffleDraw(spread.positions.length));
    resetReading();
  }

  const allRevealed = drawn !== null && drawn.every((d) => d.revealed);
  const allPicked = picks.length === spread.positions.length && picks.every(Boolean);

  /** Appends a fresh assistant slot and streams the response into it. */
  async function runStream(history: ChatMsg[], cards: CardRef[]) {
    setChatting(true);
    setThread((cur) => [...cur, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/tarot/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim() || undefined,
          spread: spreadName,
          cards,
          messages: history,
        }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setThread((cur) => {
          const copy = cur.slice();
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { role: "assistant", content: last.content + chunk };
          return copy;
        });
      }
    } finally {
      setChatting(false);
    }
  }

  function interpret() {
    const source: CardRef[] | undefined =
      mode === "draw"
        ? drawn?.map((d, i) => ({ id: d.card.id, position: spread.positions[i].name[locale], reversed: d.reversed }))
        : picks.map((p, i) => ({ id: p!.card.id, position: spread.positions[i].name[locale], reversed: p!.reversed }));
    if (!source || chatting) return;
    setActiveCards(source);
    setThread([]);
    setFollowUp("");
    runStream([], source);
  }

  function askFollowUp(e: React.FormEvent) {
    e.preventDefault();
    const qy = followUp.trim();
    if (!qy || chatting || !activeCards) return;
    setFollowUp("");
    const next: ChatMsg[] = [...thread, { role: "user", content: qy }];
    setThread(next);
    runStream(next, activeCards);
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
                resetReading();
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

          {drawn && (() => {
            const reveal = (i: number) =>
              setDrawn((cur) => cur!.map((x, xi) => (xi === i ? { ...x, revealed: true } : x)));
            const revealPair = () =>
              setDrawn((cur) => cur!.map((x, xi) => (xi <= 1 ? { ...x, revealed: true } : x)));

            const slot = (i: number, width: number, area?: string) => {
              const d = drawn[i];
              return (
                <div
                  key={`${d.card.id}-${i}`}
                  style={area ? { gridArea: area } : undefined}
                  className="flex flex-col items-center gap-2.5"
                >
                  <FlipCard
                    card={d.card}
                    reversed={d.reversed}
                    revealed={d.revealed}
                    width={width}
                    onReveal={() => reveal(i)}
                  />
                  <p className="label-caps max-w-[140px] text-center text-[10px] leading-snug">
                    {i + 1} · {spread.positions[i].name[locale]}
                  </p>
                  {d.revealed && d.reversed && (
                    <span className="border border-[var(--warning)]/50 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-[var(--warning)]">
                      {t.reversed}
                    </span>
                  )}
                </div>
              );
            };

            if (spreadId !== "cross") {
              return (
                <div className="mt-8 grid max-w-xl grid-cols-1 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3">
                  {drawn.map((_, i) => slot(i, 138))}
                </div>
              );
            }

            // Celtic Cross — true cross + staff (read bottom-up) on md+.
            const CW = 104;
            const centerCell = (
              <div key="center" style={{ gridArea: "center" }} className="flex flex-col items-center gap-2.5">
                <div className="relative" style={{ width: CW * 1.7, height: (CW * 300) / 180 }}>
                  <div className="absolute inset-0 grid place-items-center">
                    <FlipCard
                      card={drawn[0].card}
                      reversed={drawn[0].reversed}
                      revealed={drawn[0].revealed}
                      width={CW}
                      onReveal={revealPair}
                    />
                  </div>
                  <div className="absolute inset-0 grid rotate-90 place-items-center">
                    <FlipCard
                      card={drawn[1].card}
                      reversed={drawn[1].reversed}
                      revealed={drawn[1].revealed}
                      width={CW}
                      onReveal={revealPair}
                    />
                  </div>
                </div>
                <p className="label-caps max-w-[190px] text-center text-[10px] leading-snug">
                  1 · {spread.positions[0].name[locale]}
                  {drawn[0].revealed && drawn[0].reversed ? ` (${t.reversed})` : ""}
                </p>
                <p className="label-caps max-w-[190px] text-center text-[10px] leading-snug text-[var(--text-muted-color)]">
                  2 · {spread.positions[1].name[locale]}
                  {drawn[1].revealed && drawn[1].reversed ? ` (${t.reversed})` : ""}
                </p>
              </div>
            );

            return (
              <>
                <div
                  className="mt-10 hidden justify-items-center gap-x-4 gap-y-8 md:grid"
                  style={{
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gridTemplateAreas:
                      "'. crown . outcome' 'past center future hopes' '. root . env' '. . . self'",
                  }}
                >
                  {slot(4, CW, "crown")}
                  {slot(9, CW, "outcome")}
                  {slot(3, CW, "past")}
                  {centerCell}
                  {slot(5, CW, "future")}
                  {slot(8, CW, "hopes")}
                  {slot(2, CW, "root")}
                  {slot(7, CW, "env")}
                  {slot(6, CW, "self")}
                </div>
                <div className="mt-8 grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 md:hidden">
                  {drawn.map((_, i) => slot(i, 112))}
                </div>
              </>
            );
          })()}

          {allRevealed && (
            <div className="mt-8">
              <Button onClick={interpret} loading={initialLoading} disabled={chatting}>
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
            <Button onClick={interpret} loading={initialLoading} disabled={!allPicked || chatting}>
              {t.interpret} <Sparkles size={13} />
            </Button>
            <Button variant="ghost" onClick={() => setPicks(spread.positions.map(() => null))}>
              {t.clearSpread}
            </Button>
          </div>
        </div>
      )}

      {/* ── READING + FOLLOW-UP CHAT ── */}
      {thread.length > 0 && (
        <Card glow className="mt-10 p-7 md:p-9">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles size={14} className="text-[var(--gold)]" />
              <p className="label-caps">{t.interpretation}</p>
            </div>
            <button
              type="button"
              onClick={resetReading}
              className="label-caps text-[10px] text-[var(--text-muted-color)] transition hover:text-[var(--gold-light)]"
            >
              {t.newReading}
            </button>
          </div>

          <div className="space-y-6">
            {thread.map((m, i) =>
              m.role === "assistant" ? (
                <AiProse key={i} text={m.content} loading={chatting && i === thread.length - 1} />
              ) : (
                <div key={i} className="flex gap-3 border-l-2 border-[var(--gold)]/40 pl-4">
                  <CornerDownRight size={15} className="mt-1 shrink-0 text-[var(--gold)]/60" />
                  <p
                    className="italic text-[var(--gold-light)]"
                    style={{ fontFamily: "var(--font-display)", fontSize: "17px" }}
                  >
                    {m.content}
                  </p>
                </div>
              ),
            )}
          </div>

          {/* follow-up — keeps the same cards in context */}
          <form
            onSubmit={askFollowUp}
            className="mt-7 flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-5 py-3.5 transition focus-within:border-[var(--gold)]/50"
          >
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder={t.followUpPlaceholder}
              disabled={chatting}
              className="flex-1 bg-transparent text-[15px] italic text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)] disabled:opacity-50"
              style={{ fontFamily: "var(--font-display)" }}
            />
            <button
              type="submit"
              disabled={chatting || !followUp.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-[#0A0A0F] transition hover:opacity-90 disabled:opacity-40"
              aria-label={t.followUpAria}
            >
              <Send size={14} />
            </button>
          </form>
        </Card>
      )}
    </>
  );
}
