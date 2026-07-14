"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Heart, Users, Briefcase, Home } from "lucide-react";
import { Card, Button, Explainer, SignGlyph, PlanetSymbol, AiProse, type ZodiacSign } from "@/components/ui";
import type { SynastryAspect, SynastryType } from "@/lib/astrology/synastry";
import type { Planet } from "@/lib/astrology";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { Dict } from "@/lib/i18n/en";
import { PersonInput, type Person } from "./PersonInput";
import { ResonanceRing } from "./ResonanceRing";
import { SynastryAspects } from "./SynastryAspects";
import { cn } from "@/lib/utils";

interface BigThree {
  sun: ZodiacSign;
  moon: ZodiacSign;
  asc: ZodiacSign;
}

interface Result {
  score: number;
  type: SynastryType;
  aspects: SynastryAspect[];
  a: BigThree;
  b: BigThree;
}

const PERSONAL: Planet[] = ["sun", "moon", "mercury", "venus", "mars"];

const DEFAULT_B: Person = {
  name: "Élias",
  date: "1993-07-22",
  time: "18:14",
  city: { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698, timeZone: "Europe/Paris" },
};

function tierLabel(score: number, dict: Dict): string {
  if (score >= 90) return dict.synastry.tierSoulmates;
  if (score >= 75) return dict.synastry.tierPerfect;
  if (score >= 60) return dict.synastry.tierGreat;
  if (score >= 45) return dict.synastry.tierWorth;
  return dict.synastry.tierGrowth;
}

function notable(aspects: SynastryAspect[], harmonious: boolean, dict: Dict): string[] {
  const weight = (x: SynastryAspect) =>
    (PERSONAL.includes(x.planetA) ? 0 : 5) + (PERSONAL.includes(x.planetB) ? 0 : 5) + x.orb;
  return aspects
    .filter((x) => x.isHarmonious === harmonious)
    .sort((p, q) => weight(p) - weight(q))
    .slice(0, 4)
    .map(
      (x) =>
        `${dict.planets[x.planetA]} ${dict.aspects[x.type].toLowerCase()} ${dict.planets[x.planetB]} (${dict.common.orb} ${x.orb}°)`,
    );
}

function toPayload(p: Person) {
  return {
    name: p.name,
    birth: {
      date: p.date,
      time: p.time,
      lat: p.city?.lat ?? 0,
      lng: p.city?.lng ?? 0,
      timeZone: p.city?.timeZone,
    },
  };
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <span className="text-xs text-[var(--gold)]/60">✦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
    </div>
  );
}

export function SynastryClient({ initialA }: { initialA: Person }) {
  const { dict } = useI18n();
  const [type, setType] = useState<SynastryType>("love");
  const [a, setA] = useState<Person>(initialA);
  const [b, setB] = useState<Person>(DEFAULT_B);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [interp, setInterp] = useState("");
  const [interpLoading, setInterpLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const ready = Boolean(a.date && a.city && b.date && b.city);

  const TYPE_OPTIONS: { key: SynastryType; label: string; desc: string; icon: typeof Heart }[] = [
    { key: "love", label: dict.synastry.typeLove, desc: dict.synastry.typeLoveD, icon: Heart },
    { key: "friendship", label: dict.synastry.typeFriendship, desc: dict.synastry.typeFriendshipD, icon: Users },
    { key: "work", label: dict.synastry.typeWork, desc: dict.synastry.typeWorkD, icon: Briefcase },
    { key: "family", label: dict.synastry.typeFamily, desc: dict.synastry.typeFamilyD, icon: Home },
  ];
  const typeLabel = TYPE_OPTIONS.find((t) => t.key === type)!.label;

  async function calculate() {
    if (!ready) return;
    setLoading(true);
    setResult(null);
    setInterp("");
    setSaved(false);
    try {
      const res = await fetch("/api/synastry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, personA: toPayload(a), personB: toPayload(b) }),
      });
      const d = await res.json();
      if (!d.error) setResult(d as Result);
    } finally {
      setLoading(false);
    }
  }

  async function fullInterpretation() {
    if (!result) return;
    setInterpLoading(true);
    setInterp("");
    const strengths = notable(result.aspects, true, dict);
    const challenges = notable(result.aspects, false, dict);
    const context =
      `Synastry (${typeLabel}): ${a.name || "A"} (${dict.planets.sun} ${dict.zodiac.names[result.a.sun]}, ` +
      `${dict.planets.moon} ${dict.zodiac.names[result.a.moon]}, ASC ${dict.zodiac.names[result.a.asc]}) × ` +
      `${b.name || "B"} (${dict.planets.sun} ${dict.zodiac.names[result.b.sun]}, ` +
      `${dict.planets.moon} ${dict.zodiac.names[result.b.moon]}, ASC ${dict.zodiac.names[result.b.asc]}). ` +
      `${dict.synastry.resonance} ${result.score}/100 — ${tierLabel(result.score, dict)}. ` +
      `${dict.synastry.strengths}: ${strengths.join("; ")}. ${dict.synastry.edges}: ${challenges.join("; ")}.`;
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Write a full ${typeLabel.toLowerCase()} compatibility reading for these two people based on their synastry.`,
          context,
        }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setInterp((t) => t + dec.decode(value, { stream: true }));
      }
    } finally {
      setInterpLoading(false);
    }
  }

  const strengths = result ? notable(result.aspects, true, dict) : [];
  const challenges = result ? notable(result.aspects, false, dict) : [];

  return (
    <>
      {/* bond type */}
      <p className="label-caps mb-3">{dict.synastry.typeLabel}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TYPE_OPTIONS.map((t) => {
          const Icon = t.icon;
          const active = type === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setType(t.key);
                setResult(null);
                setInterp("");
              }}
              className={cn(
                "border p-4 text-left transition-all duration-300",
                active
                  ? "border-[var(--gold)]/60 bg-gradient-to-br from-[var(--purple-deep)]/30 to-transparent shadow-[0_0_24px_rgba(201,168,76,0.15)]"
                  : "border-[var(--gold)]/12 hover:-translate-y-0.5 hover:border-[var(--gold)]/30",
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={15} strokeWidth={1.5} className={active ? "text-[var(--gold)]" : "text-[var(--text-muted-color)]"} />
                <span className="font-display text-lg text-[var(--text-primary-color)]">{t.label}</span>
              </div>
              <p className="mt-1.5 hidden text-[11px] leading-relaxed text-[var(--text-secondary-color)] sm:block">{t.desc}</p>
            </button>
          );
        })}
      </div>

      <Explainer title={dict.synastry.methodTitle} body={dict.synastry.methodNote} className="mt-4" />

      {/* people */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {([
          { person: a, set: setA, three: result?.a },
          { person: b, set: setB, three: result?.b },
        ] as const).map((side, i) => (
          <Card key={i} className="p-7">
            <PersonInput
              value={side.person}
              onChange={side.set}
              badge={
                side.three ? (
                  <SignGlyph sign={side.three.sun} size={13} strokeWidth={2.2} />
                ) : (
                  <PlanetSymbol planet={i === 0 ? "sun" : "moon"} size={13} strokeWidth={2.2} />
                )
              }
            />
            {side.three && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--gold)]/15 pt-4">
                {([
                  ["sun", side.three.sun],
                  ["moon", side.three.moon],
                  ["asc", side.three.asc],
                ] as const).map(([kind, sign]) => (
                  <span
                    key={kind}
                    className="flex items-center gap-1.5 border border-[var(--gold)]/20 px-2.5 py-1 text-[11px] tracking-wider text-[var(--text-secondary-color)]"
                  >
                    <span className="text-[var(--gold-light)]">
                      {kind === "asc" ? "↑" : <PlanetSymbol planet={kind} size={12} strokeWidth={2.2} />}
                    </span>
                    {dict.zodiac.names[sign]}
                    <SignGlyph sign={sign} size={12} strokeWidth={2.2} className="text-[var(--gold)]" />
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={calculate} loading={loading} disabled={!ready}>
          {dict.synastry.calculate} <ArrowRight size={14} />
        </Button>
      </div>

      {result && (
        <div className="animate-fade-up mt-14">
          <div className="flex justify-center">
            <ResonanceRing score={result.score} label={`${tierLabel(result.score, dict)} · ${typeLabel}`} />
          </div>

          <div className="mt-14">
            <Divider />
            <h3 className="mb-6 mt-8 font-display text-2xl" style={{ fontWeight: 400 }}>
              {dict.synastry.interAspects}
            </h3>
            <SynastryAspects aspects={result.aspects} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-7">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg text-[var(--success)]">✦</span>
                <p className="label-caps text-[var(--success)]">{dict.synastry.strengths}</p>
              </div>
              <ul className="space-y-3" style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--text-primary-color)" }}>
                {strengths.length ? (
                  strengths.map((s) => (
                    <li key={s} className="flex gap-3"><span className="mt-1 text-[var(--gold)]">·</span>{s}</li>
                  ))
                ) : (
                  <li className="text-[var(--text-muted-color)]">{dict.synastry.quietSky}</li>
                )}
              </ul>
            </Card>

            <Card className="p-7">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg text-[var(--warning)]">△</span>
                <p className="label-caps text-[var(--warning)]">{dict.synastry.edges}</p>
              </div>
              <ul className="space-y-3" style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--text-primary-color)" }}>
                {challenges.length ? (
                  challenges.map((s) => (
                    <li key={s} className="flex gap-3"><span className="mt-1 text-[var(--gold)]">·</span>{s}</li>
                  ))
                ) : (
                  <li className="text-[var(--text-muted-color)]">{dict.synastry.smoothWaters}</li>
                )}
              </ul>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={fullInterpretation} loading={interpLoading}>
              {dict.synastry.fullInterp} <Sparkles size={13} />
            </Button>
            <Button variant="ghost" onClick={() => setSaved(true)}>
              {saved ? dict.common.saved : dict.synastry.saveCompat}
            </Button>
          </div>

          {(interp || interpLoading) && (
            <Card className="mt-6 p-7">
              <AiProse text={interp} loading={interpLoading} />
            </Card>
          )}
        </div>
      )}
    </>
  );
}
