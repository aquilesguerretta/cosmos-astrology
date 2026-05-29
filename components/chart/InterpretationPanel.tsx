"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { ChartData, PlanetPosition } from "@/lib/astrology";
import { Card, PLANET_GLYPHS, PLANET_NAMES, ZODIAC_BY_KEY } from "@/components/ui";
import { ASPECT_META } from "./aspectMeta";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function aspectsFor(planet: PlanetPosition["planet"], chart: ChartData): string[] {
  return chart.aspects
    .filter((a) => a.planet1 === planet || a.planet2 === planet)
    .map((a) => {
      const other = a.planet1 === planet ? a.planet2 : a.planet1;
      return `${ASPECT_META[a.type].label.toLowerCase()} ${PLANET_NAMES[other]} (orb ${a.orb}°)`;
    });
}

function InterpretationCard({ p, chart }: { p: PlanetPosition; chart: ChartData }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const signName = ZODIAC_BY_KEY[p.sign].name;

  async function interpret() {
    setLoading(true);
    setText("");
    try {
      const res = await fetch("/api/chart/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planet: PLANET_NAMES[p.planet],
          sign: signName,
          house: p.house,
          aspects: aspectsFor(p.planet, chart),
        }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((t) => t + dec.decode(value, { stream: true }));
      }
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !text && !loading) interpret();
  }

  return (
    <Card className="p-5">
      <button onClick={toggle} className="flex w-full items-center justify-between text-left">
        <span className="flex items-center gap-3">
          <span className="font-display text-xl text-[var(--gold-light)]">{PLANET_GLYPHS[p.planet]}</span>
          <span className="font-display text-lg text-[var(--text-primary-color)]">
            {PLANET_NAMES[p.planet]} in {signName}, House {ROMAN[p.house - 1]}
            {p.isRetrograde && <span className="ml-1.5 text-xs text-[var(--warning)]">℞</span>}
          </span>
        </span>
        <span className="text-xs text-[var(--gold)]/70">{open ? "—" : "+"}</span>
      </button>
      {open && (
        <p
          className="animate-fade-up mt-4 leading-[1.75] text-[var(--text-secondary-color)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}
        >
          {text}
          {loading && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[var(--gold)]/60 align-middle" />}
        </p>
      )}
    </Card>
  );
}

export function InterpretationPanel({ chartData }: { chartData: ChartData }) {
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles size={14} className="text-[var(--gold)]" />
        <h3 className="font-display text-2xl" style={{ fontWeight: 400 }}>The Interpretation</h3>
        <span className="label-caps ml-auto text-[var(--text-muted-color)]">Composed by Cosmos</span>
      </div>
      <div className="space-y-3">
        {chartData.planets
          .filter((p) => p.planet !== "northNode")
          .map((p) => (
            <InterpretationCard key={p.planet} p={p} chart={chartData} />
          ))}
      </div>
    </section>
  );
}
