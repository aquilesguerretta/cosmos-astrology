"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, Button, ZODIAC_BY_KEY, type ZodiacSign } from "@/components/ui";
import type { SynastryAspect } from "@/lib/astrology/synastry";
import { PersonInput, type Person } from "./PersonInput";
import { ResonanceRing } from "./ResonanceRing";
import { SynastryAspects } from "./SynastryAspects";

interface Result {
  score: number;
  label: string;
  strengths: string[];
  challenges: string[];
  aspects: SynastryAspect[];
  a: { sun: ZodiacSign };
  b: { sun: ZodiacSign };
}

const DEFAULT_B: Person = {
  name: "Élias",
  date: "1993-07-22",
  time: "18:14",
  cityName: "Marseille, France",
  lat: 43.2965,
  lng: 5.3698,
  utcOffset: 2,
};

const toPayload = (p: Person) => ({
  name: p.name,
  birth: { date: p.date, time: p.time, lat: p.lat, lng: p.lng, utcOffset: p.utcOffset },
});

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
  const [a, setA] = useState<Person>(initialA);
  const [b, setB] = useState<Person>(DEFAULT_B);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [interp, setInterp] = useState("");
  const [interpLoading, setInterpLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function calculate() {
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
    const context =
      `Synastry between ${a.name} (Sun ${ZODIAC_BY_KEY[result.a.sun].name}) and ${b.name} ` +
      `(Sun ${ZODIAC_BY_KEY[result.b.sun].name}). Resonance ${result.score}/100 — ${result.label}. ` +
      `Strengths: ${result.strengths.join("; ")}. Challenges: ${result.challenges.join("; ")}.`;
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
        <Button onClick={calculate} loading={loading}>
          Calculate Resonance <ArrowRight size={14} />
        </Button>
      </div>

      {result && (
        <div className="animate-fade-up mt-14">
          <div className="flex justify-center">
            <ResonanceRing score={result.score} label={result.label} />
          </div>

          <div className="mt-14">
            <Divider />
            <h3 className="mb-6 mt-8 font-display text-2xl" style={{ fontWeight: 400 }}>The Inter-aspects</h3>
            <SynastryAspects aspects={result.aspects} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-7">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg text-[var(--success)]">✦</span>
                <p className="label-caps text-[var(--success)]">The Strengths</p>
              </div>
              <ul className="space-y-3" style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--text-primary-color)" }}>
                {result.strengths.length ? (
                  result.strengths.map((s) => (
                    <li key={s} className="flex gap-3"><span className="mt-1 text-[var(--gold)]">·</span>{s}</li>
                  ))
                ) : (
                  <li className="text-[var(--text-muted-color)]">A quiet sky — few major contacts.</li>
                )}
              </ul>
            </Card>

            <Card className="p-7">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-lg text-[var(--warning)]">△</span>
                <p className="label-caps text-[var(--warning)]">The Edges</p>
              </div>
              <ul className="space-y-3" style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--text-primary-color)" }}>
                {result.challenges.length ? (
                  result.challenges.map((s) => (
                    <li key={s} className="flex gap-3"><span className="mt-1 text-[var(--gold)]">·</span>{s}</li>
                  ))
                ) : (
                  <li className="text-[var(--text-muted-color)]">Smooth waters — little friction to name.</li>
                )}
              </ul>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={fullInterpretation} loading={interpLoading}>
              Full interpretation <Sparkles size={13} />
            </Button>
            <Button variant="ghost" onClick={() => setSaved(true)}>
              {saved ? "Saved ✓" : "Save compatibility"}
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
