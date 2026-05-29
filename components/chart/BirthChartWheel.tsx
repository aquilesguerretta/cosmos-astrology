"use client";

import { useMemo, useState } from "react";
import type { ChartData, Planet, PlanetPosition } from "@/lib/astrology";
import { PLANET_GLYPHS, PLANET_NAMES, ZODIAC } from "@/components/ui";
import { ASPECT_META } from "./aspectMeta";

interface BirthChartWheelProps {
  chartData: ChartData;
  size?: number;
  onPlanetClick?: (planet: PlanetPosition) => void;
  highlightedPlanet?: Planet | null;
  onPlanetHover?: (planet: Planet | null) => void;
}

// Fixed 600-unit coordinate space (scaled to `size` via viewBox).
const C = 300;
const R = { outer: 280, signInner: 255, degInner: 232, house: 200, cusp: 175, planet: 140, aspect: 110, center: 40 };
// Round rendered coords: Math.sin/cos may differ in the last ULP between the
// SSR (Node) and client (browser) engines, which would trip hydration.
const round2 = (n: number) => Math.round(n * 100) / 100;
const ELEMENT_COLOR: Record<string, string> = {
  Fire: "#E85C4C", Earth: "#4CAF82", Air: "#E8C97A", Water: "#4A90D9",
};
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const norm360 = (x: number) => ((x % 360) + 360) % 360;

export function BirthChartWheel({
  chartData,
  size = 600,
  onPlanetClick,
  highlightedPlanet = null,
  onPlanetHover,
}: BirthChartWheelProps) {
  const asc = chartData.angles.asc;
  const [hoverPlanet, setHoverPlanet] = useState<Planet | null>(null);
  const [hoverHouse, setHoverHouse] = useState<number | null>(null);
  const [hoverAspect, setHoverAspect] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; lines: string[] } | null>(null);

  const active = highlightedPlanet ?? hoverPlanet;

  // ASC fixed on the left (9 o'clock); zodiac increases counter-clockwise.
  const pt = (lon: number, r: number) => {
    const theta = ((180 + (lon - asc)) * Math.PI) / 180;
    return { x: round2(C + r * Math.cos(theta)), y: round2(C - r * Math.sin(theta)) };
  };

  const lonOf = useMemo(() => {
    const m = {} as Record<Planet, number>;
    for (const p of chartData.planets) m[p.planet] = p.longitude;
    return m;
  }, [chartData]);

  // Collision: stagger clustered planet glyphs inward.
  const radiusOf = useMemo(() => {
    const items = chartData.planets
      .map((p) => ({ planet: p.planet, vis: norm360(p.longitude - asc) }))
      .sort((a, b) => a.vis - b.vis);
    const out = {} as Record<Planet, number>;
    let level = 0;
    for (let i = 0; i < items.length; i++) {
      if (i > 0 && items[i].vis - items[i - 1].vis < 9) level += 1;
      else level = 0;
      out[items[i].planet] = R.planet - Math.min(level, 3) * 20;
    }
    return out;
  }, [chartData, asc]);

  const planetsInHouse = (h: number) =>
    chartData.planets.filter((p) => p.house === h).map((p) => PLANET_GLYPHS[p.planet]).join(" ");

  const showTip = (lon: number, r: number, lines: string[]) => {
    const { x, y } = pt(lon, r);
    setTip({ x: Math.max(70, Math.min(530, x)), y: Math.max(40, Math.min(560, y)), lines });
  };

  const cusps = chartData.houses;

  return (
    <svg viewBox="0 0 600 600" width={size} height={size} className="h-auto max-w-full select-none">
      <defs>
        <radialGradient id="wheel-bg" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#2D1B69" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#1E3A5F" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={R.outer} fill="url(#wheel-bg)" />
      {[R.outer, R.signInner, R.degInner, R.house, R.center].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#C9A84C" strokeWidth={r === R.outer ? 0.8 : 0.4} opacity={r === R.outer ? 0.7 : 0.35} />
      ))}

      {/* interactive house sectors (behind content) */}
      {cusps.map((c, i) => {
        const next = cusps[(i + 1) % 12];
        const a = pt(c.longitude, R.center);
        const b = pt(c.longitude, R.house);
        const d = pt(next.longitude, R.house);
        const e = pt(next.longitude, R.center);
        const large = norm360(next.longitude - c.longitude) > 180 ? 1 : 0;
        const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} A ${R.house} ${R.house} 0 ${large} 0 ${d.x} ${d.y} L ${e.x} ${e.y} A ${R.center} ${R.center} 0 ${large} 1 ${a.x} ${a.y} Z`;
        return (
          <path
            key={`hs-${i}`}
            d={path}
            fill={hoverHouse === c.house ? "rgba(201,168,76,0.10)" : "transparent"}
            stroke={hoverHouse === c.house ? "rgba(201,168,76,0.4)" : "transparent"}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => { setHoverHouse(c.house); const mid = c.longitude + norm360(next.longitude - c.longitude) / 2; showTip(mid, R.cusp, [`House ${ROMAN[c.house - 1]}`, planetsInHouse(c.house) || "—"]); }}
            onMouseLeave={() => { setHoverHouse(null); setTip(null); }}
          />
        );
      })}

      {/* sign sectors */}
      {ZODIAC.map((z, i) => {
        const start = i * 30;
        const p1 = pt(start, R.outer);
        const p2 = pt(start + 30, R.outer);
        const p3 = pt(start + 30, R.signInner);
        const p4 = pt(start, R.signInner);
        const g = pt(start + 15, (R.outer + R.signInner) / 2);
        const div = pt(start, R.signInner);
        const divO = pt(start, R.outer);
        return (
          <g key={z.key} pointerEvents="none">
            <path d={`M ${p1.x} ${p1.y} A ${R.outer} ${R.outer} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${R.signInner} ${R.signInner} 0 0 1 ${p4.x} ${p4.y} Z`} fill={ELEMENT_COLOR[z.element]} opacity={0.08} />
            <line x1={div.x} y1={div.y} x2={divO.x} y2={divO.y} stroke="#C9A84C" strokeWidth={0.4} opacity={0.4} />
            <text x={g.x} y={g.y} fontSize={20} fill="#E8C97A" textAnchor="middle" dominantBaseline="central" className="font-display">{z.glyph}</text>
          </g>
        );
      })}

      {/* degree ticks */}
      {Array.from({ length: 360 }).map((_, i) => {
        const rIn = i % 30 === 0 ? R.degInner : i % 10 === 0 ? 240 : i % 5 === 0 ? 245 : 250;
        const a = pt(i, R.signInner);
        const b = pt(i, rIn);
        return <line key={`t-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#C9A84C" strokeWidth={i % 30 === 0 ? 0.7 : 0.3} opacity={i % 30 === 0 ? 0.6 : 0.3} pointerEvents="none" />;
      })}

      {/* house cusp lines + numbers */}
      {cusps.map((c, i) => {
        const isAngle = c.house === 1 || c.house === 4 || c.house === 7 || c.house === 10;
        const a = pt(c.longitude, R.center);
        const b = pt(c.longitude, R.house);
        const next = cusps[(i + 1) % 12];
        const mid = c.longitude + norm360(next.longitude - c.longitude) / 2;
        const num = pt(mid, R.cusp);
        return (
          <g key={`c-${i}`} pointerEvents="none">
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isAngle ? "#E8C97A" : "#C9A84C"} strokeWidth={isAngle ? 1.1 : 0.4} opacity={isAngle ? 0.8 : 0.4} />
            <text x={num.x} y={num.y} fontSize={11} fill="#9B97A8" textAnchor="middle" dominantBaseline="central" letterSpacing="0.1em">{ROMAN[c.house - 1]}</text>
          </g>
        );
      })}

      {/* aspect web */}
      {chartData.aspects.map((asp, i) => {
        const l1 = lonOf[asp.planet1];
        const l2 = lonOf[asp.planet2];
        if (l1 == null || l2 == null) return null;
        const a = pt(l1, R.aspect);
        const b = pt(l2, R.aspect);
        const meta = ASPECT_META[asp.type];
        const involvesActive = active && (asp.planet1 === active || asp.planet2 === active);
        const baseOpacity = asp.type === "conjunction" ? 0.5 : 0.7;
        const opacity = active ? (involvesActive ? 0.95 : 0.06) : hoverAspect === i ? 1 : baseOpacity;
        return (
          <g key={`a-${i}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={meta.color} strokeWidth={involvesActive || hoverAspect === i ? 1.6 : 0.8} opacity={opacity} />
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={7}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => { setHoverAspect(i); showTip((l1 + l2) / 2, R.center / 2, [`${PLANET_NAMES[asp.planet1]} ${meta.symbol} ${PLANET_NAMES[asp.planet2]}`, `${meta.label} · orb ${asp.orb}°`, asp.isApplying ? "applying" : "separating"]); }}
              onMouseLeave={() => { setHoverAspect(null); setTip(null); }}
            />
          </g>
        );
      })}

      {/* planets */}
      {chartData.planets.map((p) => {
        const r = radiusOf[p.planet];
        const g = pt(p.longitude, r);
        const tick1 = pt(p.longitude, R.house);
        const tick2 = pt(p.longitude, R.house - 6);
        const isActive = active === p.planet;
        return (
          <g key={p.planet}>
            <line x1={tick1.x} y1={tick1.y} x2={tick2.x} y2={tick2.y} stroke="#E8C97A" strokeWidth={0.8} opacity={0.7} pointerEvents="none" />
            <circle cx={g.x} cy={g.y} r={15} fill={isActive ? "rgba(201,168,76,0.15)" : "#0A0A0F"} stroke={isActive ? "#E8C97A" : "rgba(201,168,76,0.4)"} strokeWidth={isActive ? 1 : 0.5} />
            <text x={g.x} y={g.y} fontSize={isActive ? 18 : 16} fill={isActive ? "#E8C97A" : "#C9A84C"} textAnchor="middle" dominantBaseline="central" className="font-display" pointerEvents="none">{PLANET_GLYPHS[p.planet]}</text>
            {p.isRetrograde && <text x={g.x + 11} y={g.y - 9} fontSize={8} fill="#E8A94C" textAnchor="middle" pointerEvents="none">℞</text>}
            <circle
              cx={g.x} cy={g.y} r={16} fill="transparent" style={{ cursor: "pointer" }}
              onMouseEnter={() => { setHoverPlanet(p.planet); onPlanetHover?.(p.planet); showTip(p.longitude, r, [PLANET_NAMES[p.planet], `${ZODIAC[Math.floor(norm360(p.longitude) / 30)].glyph} ${p.degree}°${String(p.minutes).padStart(2, "0")}'`, `House ${ROMAN[p.house - 1]}${p.isRetrograde ? " · ℞" : ""}`]); }}
              onMouseLeave={() => { setHoverPlanet(null); onPlanetHover?.(null); setTip(null); }}
              onClick={() => onPlanetClick?.(p)}
            />
          </g>
        );
      })}

      {/* angle markers */}
      {([["asc", "ASC"], ["mc", "MC"], ["dsc", "DSC"], ["ic", "IC"]] as const).map(([k, label]) => {
        const lon = chartData.angles[k];
        const lab = pt(lon, R.outer + 14);
        return <text key={k} x={lab.x} y={lab.y} fontSize={11} fill="#E8C97A" textAnchor="middle" dominantBaseline="central" letterSpacing="0.15em" className="font-display" pointerEvents="none">{label}</text>;
      })}

      {/* tooltip */}
      {tip && (
        <g pointerEvents="none">
          <rect
            x={tip.x + 12}
            y={tip.y - 8 - tip.lines.length * 14}
            width={Math.max(...tip.lines.map((l) => l.length)) * 6.6 + 16}
            height={tip.lines.length * 14 + 12}
            rx={4}
            fill="rgba(10,10,15,0.95)"
            stroke="rgba(201,168,76,0.4)"
            strokeWidth={0.6}
          />
          {tip.lines.map((line, i) => (
            <text key={i} x={tip.x + 20} y={tip.y - 4 - (tip.lines.length - 1 - i) * 14} fontSize={11} fill={i === 0 ? "#F0EDE8" : "#9B97A8"} className={i === 0 ? "font-display" : ""}>{line}</text>
          ))}
        </g>
      )}
    </svg>
  );
}
