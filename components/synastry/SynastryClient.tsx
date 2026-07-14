"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, Button, ZODIAC_BY_KEY, type ZodiacSign } from "@/components/ui";
import type { SynastryAspect } from "@/lib/astrology/synastry";
import type { Planet } from "@/lib/astrology";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { Dict } from "@/lib/i18n/en";
import { PersonInput, type Person } from "./PersonInput";
import { ResonanceRing } from "./ResonanceRing";
import { SynastryAspects } from "./SynastryAspects";

interface Result {
  score: number;
  aspects: SynastryAspect[];
  a: { sun: ZodiacSign };
  b: { sun: ZodiacSign };
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
  const [a, setA] = useState<Person>(initialA);
  const [b, setB] = useState<Person>(DEFAULT_B);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [interp, setInterp] = useState("");
  const [interpLoading, setInterpLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const ready = Boolean(a.date && a.city && b.date && b.city);

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
        body: JSON.stringify({ personA: toPayload(a), personB: toPayload(b) }),
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
      `Synastry: ${a.name || "A"} (${dict.planets.sun} ${dict.zodiac.names[result.a.sun]}) × ` +
      `${b.name || "B"} (${dict.planets.sun} ${dict.zodiac.names[result.b.sun]}). ` +
      `${dict.synastry.resonance} ${result.score}/100 — ${tierLabel(result.score, dict)}. ` +
      `${dict.synastry.strengths}: ${strengths.join("; ")}. ${dict.synastry.edges}: ${challenges.join("; ")}.`;
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "Write a full compatibility reading for these two people based on their synastry.",
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-7">
          <PersonInput value={a} onChange={setA} glyph={result ? ZODIAC_BY_KEY[result.a.sun].glyph : "☉"} />
        </Card>
        <Card className="p-7">
          <PersonInput value={b} onChange={setB} glyph={result ? ZODIAC_BY_KEY[result.b.sun].glyph : "☽"} />
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={calculate} loading={loading} disabled={!ready}>
          {dict.synastry.calculate} <ArrowRight size={14} />
        </Button>
      </div>

      {result && (
        <div className="animate-fade-up mt-14">
          <div className="flex justify-center">
            <ResonanceRing score={result.score} label={tierLabel(result.score, dict)} />
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
              <p className="leading-[1.8] text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
                {interp}
                {interpLoading && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[var(--gold)]/60 align-middle" />}
              </p>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
