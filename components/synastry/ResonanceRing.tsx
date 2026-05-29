"use client";

import { useEffect, useState } from "react";

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 2000;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * ease));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}</span>;
}

const R = 90;
const CIRC = 2 * Math.PI * R;

export function ResonanceRing({ score, label }: { score: number; label: string }) {
  const color = score >= 75 ? "#E8C97A" : score >= 60 ? "#4CAF82" : "#E8A94C";
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-56 w-56 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="3" />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * CIRC} ${CIRC}`}
            style={{ transition: "stroke-dasharray 2s cubic-bezier(.2,.8,.2,1)" }}
          />
        </svg>
        <div className="text-center">
          <p className="label-caps text-[var(--gold)]/80">Resonance</p>
          <p className="font-display gold-text mt-1 text-6xl">
            <CountUp to={score} />
            <span className="text-2xl">%</span>
          </p>
        </div>
      </div>
      <div
        className="mt-4 flex items-center gap-2 text-sm italic text-[var(--gold-light)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="text-[var(--gold)]">✦</span> {label} <span className="text-[var(--gold)]">✦</span>
      </div>
    </div>
  );
}
