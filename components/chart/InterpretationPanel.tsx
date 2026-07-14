"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { ChartData, PlanetPosition } from "@/lib/astrology";
import { Card, PlanetSymbol, AiProse } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { Dict } from "@/lib/i18n/en";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

function aspectsFor(planet: PlanetPosition["planet"], chart: ChartData, dict: Dict): string[] {
  return chart.aspects
    .filter((a) => a.planet1 === planet || a.planet2 === planet)
    .map((a) => {
      const other = a.planet1 === planet ? a.planet2 : a.planet1;
      return `${dict.aspects[a.type].toLowerCase()} ${dict.planets[other]} (${dict.common.orb} ${a.orb}°)`;
    });
}

function InterpretationCard({ p, chart }: { p: PlanetPosition; chart: ChartData }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const signName = dict.zodiac.names[p.sign];

  async function interpret() {
    setLoading(true);
    setText("");
    try {
      const res = await fetch("/api/chart/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planet: dict.planets[p.planet],
          sign: signName,
          house: p.house,
          aspects: aspectsFor(p.planet, chart, dict),
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
      <button onClick={toggle} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="flex items-center gap-3">
          <span className="text-[var(--gold-light)]">
            <PlanetSymbol planet={p.planet} size={20} strokeWidth={1.7} />
          </span>
          <span className="font-display text-lg text-[var(--text-primary-color)]">
            {dict.planets[p.planet]} {dict.chart.inSign} {signName}, {dict.common.house} {ROMAN[p.house - 1]}
            {p.isRetrograde && <span className="ml-1.5 text-xs text-[var(--warning)]">℞</span>}
          </span>
        </span>
        <span className="text-xs text-[var(--gold)]/70">{open ? "—" : "+"}</span>
      </button>
      {open && (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <AiProse text={text} loading={loading} />
        </div>
      )}
    </Card>
  );
}

export function InterpretationPanel({ chartData }: { chartData: ChartData }) {
  const { dict } = useI18n();
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center gap-3">
        <Sparkles size={14} className="text-[var(--gold)]" />
        <h3 className="font-display text-2xl" style={{ fontWeight: 400 }}>{dict.chart.interpretationTitle}</h3>
        <span className="label-caps ml-auto hidden text-[var(--text-muted-color)] sm:block">{dict.chart.composedBy}</span>
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
