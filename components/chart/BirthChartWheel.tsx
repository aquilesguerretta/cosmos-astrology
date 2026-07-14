"use client";

import { useId, useMemo, useState } from "react";
import type { ChartData, Planet, PlanetPosition } from "@/lib/astrology";
import { PLANET_GLYPHS, ZODIAC } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
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
const R = {
  rim: 288,
  outer: 280,
  signInner: 250,
  degInner: 228,
  house: 200,
  cusp: 172,
  planet: 140,
  aspect: 108,
  center: 46,
};
// Round rendered coords: Math.sin/cos may differ in the last ULP between the
// SSR (Node) and client (browser) engines, which would trip hydration.
const round2 = (n: number) => Math.round(n * 100) / 100;
const ELEMENT_COLOR: Record<string, string> = {
  Fire: "#E85C4C",
  Earth: "#4CAF82",
  Air: "#E8C97A",
  Water: "#4A90D9",
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
  const { dict } = useI18n();
  const uid = useId().replace(/:/g, "");
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
      out[items[i].planet] = R.planet - Math.min(level, 3) * 21;
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
        <radialGradient id={`wbg-${uid}`} cx="0.5" cy="0.5" r="0.62">
          <stop offset="0%" stopColor="#2D1B69" stopOpacity="0.42" />
          <stop offset="52%" stopColor="#1E3A5F" stopOpacity="0.16" />
          <stop offset="82%" stopColor="#12121A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`wsignband-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="82%" stopColor="#12121A" stopOpacity="0" />
          <stop offset="88%" stopColor="#C9A84C" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.12" />
        </radialGradient>
        <radialGradient id={`wplanet-${uid}`} cx="0.38" cy="0.32" r="1">
          <stop offset="0%" stopColor="#1d1d2b" />
          <stop offset="100%" stopColor="#0A0A0F" />
        </radialGradient>
        <linearGradient id={`wgold-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C97A" />
          <stop offset="55%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#9A7A2E" />
        </linearGradient>
        <filter id={`wglow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`wglowsoft-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── ground ── */}
      <circle cx={C} cy={C} r={R.rim} fill={`url(#wbg-${uid})`} />
      <circle cx={C} cy={C} r={R.rim} fill={`url(#wsignband-${uid})`} />

      {/* rim: double gold ring + fine minute ticks */}
      <circle cx={C} cy={C} r={R.rim} fill="none" stroke={`url(#wgold-${uid})`} strokeWidth="1.1" opacity="0.85" />
      <circle cx={C} cy={C} r={R.outer} fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.6" />
      <circle cx={C} cy={C} r={R.signInner} fill="none" stroke="#C9A84C" strokeWidth="0.45" opacity="0.5" />
      <circle cx={C} cy={C} r={R.degInner} fill="none" stroke="#C9A84C" strokeWidth="0.35" opacity="0.35" />
      <circle cx={C} cy={C} r={R.house} fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4" />
      <circle cx={C} cy={C} r={R.center} fill="#0A0A0F" stroke="#C9A84C" strokeWidth="0.5" opacity="0.9" />

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
            stroke={hoverHouse === c.house ? "rgba(201,168,76,0.45)" : "transparent"}
            strokeWidth="0.6"
            style={{ cursor: "pointer", transition: "fill 0.25s" }}
            onMouseEnter={() => {
              setHoverHouse(c.house);
              const mid = c.longitude + norm360(next.longitude - c.longitude) / 2;
              showTip(mid, R.cusp, [`${dict.common.house} ${ROMAN[c.house - 1]}`, planetsInHouse(c.house) || "—"]);
            }}
            onMouseLeave={() => {
              setHoverHouse(null);
              setTip(null);
            }}
          />
        );
      })}

      {/* sign band: element-tinted sectors + glowing glyphs */}
      {ZODIAC.map((z, i) => {
        const start = i * 30;
        const p1 = pt(start, R.outer);
        const p2 = pt(start + 30, R.outer);
        const p3 = pt(start + 30, R.signInner);
        const p4 = pt(start, R.signInner);
        const g = pt(start + 15, (R.outer + R.signInner) / 2);
        const div1 = pt(start, R.signInner);
        const div2 = pt(start, R.rim);
        return (
          <g key={z.key} pointerEvents="none">
            <path
              d={`M ${p1.x} ${p1.y} A ${R.outer} ${R.outer} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${R.signInner} ${R.signInner} 0 0 1 ${p4.x} ${p4.y} Z`}
              fill={ELEMENT_COLOR[z.element]}
              opacity={0.09}
            />
            <line x1={div1.x} y1={div1.y} x2={div2.x} y2={div2.y} stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
            <text
              x={g.x}
              y={g.y}
              fontSize={21}
              fill="#E8C97A"
              textAnchor="middle"
              dominantBaseline="central"
              className="font-display"
              filter={`url(#wglow-${uid})`}
              opacity={0.95}
            >
              {z.glyph}
            </text>
          </g>
        );
      })}

      {/* degree ticks */}
      {Array.from({ length: 360 }).map((_, i) => {
        const rIn = i % 30 === 0 ? R.degInner : i % 10 === 0 ? 236 : i % 5 === 0 ? 241 : 246;
        const a = pt(i, R.signInner);
        const b = pt(i, rIn);
        return (
          <line
            key={`t-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={i % 30 === 0 ? "#E8C97A" : "#C9A84C"}
            strokeWidth={i % 30 === 0 ? 0.8 : i % 10 === 0 ? 0.5 : 0.3}
            opacity={i % 30 === 0 ? 0.7 : i % 10 === 0 ? 0.45 : 0.28}
            pointerEvents="none"
          />
        );
      })}

      {/* house cusp lines + roman numerals */}
      {cusps.map((c, i) => {
        const isAngle = c.house === 1 || c.house === 4 || c.house === 7 || c.house === 10;
        const a = pt(c.longitude, R.center);
        const b = pt(c.longitude, R.house);
        const next = cusps[(i + 1) % 12];
        const mid = c.longitude + norm360(next.longitude - c.longitude) / 2;
        const num = pt(mid, R.cusp + 14);
        return (
          <g key={`c-${i}`} pointerEvents="none">
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isAngle ? `url(#wgold-${uid})` : "#C9A84C"}
              strokeWidth={isAngle ? 1.3 : 0.4}
              opacity={isAngle ? 0.9 : 0.4}
            />
            <text
              x={num.x} y={num.y}
              fontSize={11}
              fill={hoverHouse === c.house ? "#E8C97A" : "#9B97A8"}
              textAnchor="middle"
              dominantBaseline="central"
              letterSpacing="0.12em"
              className="font-display"
            >
              {ROMAN[c.house - 1]}
            </text>
          </g>
        );
      })}

      {/* center rosette */}
      <g pointerEvents="none" opacity="0.85">
        <circle cx={C} cy={C} r={R.center - 8} fill="none" stroke="#C9A84C" strokeWidth="0.35" opacity="0.5" />
        <circle cx={C} cy={C} r={R.center - 16} fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.35" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a1 = pt(i * 30, R.center - 8);
          const a2 = pt(i * 30, R.center - 16);
          return <line key={i} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke="#C9A84C" strokeWidth="0.3" opacity="0.4" />;
        })}
        <circle cx={C} cy={C} r={2.4} fill="#E8C97A" filter={`url(#wglowsoft-${uid})`} />
      </g>

      {/* aspect web */}
      {chartData.aspects.map((asp, i) => {
        const l1 = lonOf[asp.planet1];
        const l2 = lonOf[asp.planet2];
        if (l1 == null || l2 == null) return null;
        const a = pt(l1, R.aspect);
        const b = pt(l2, R.aspect);
        const meta = ASPECT_META[asp.type];
        const involvesActive = active && (asp.planet1 === active || asp.planet2 === active);
        const baseOpacity = asp.type === "conjunction" ? 0.45 : 0.62;
        const opacity = active ? (involvesActive ? 0.95 : 0.05) : hoverAspect === i ? 1 : baseOpacity;
        const emphasized = involvesActive || hoverAspect === i;
        return (
          <g key={`a-${i}`}>
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={meta.color}
              strokeWidth={emphasized ? 1.7 : 0.8}
              opacity={opacity}
              filter={emphasized ? `url(#wglow-${uid})` : undefined}
              style={{ transition: "opacity 0.25s" }}
            />
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="transparent" strokeWidth={7}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => {
                setHoverAspect(i);
                showTip((l1 + l2) / 2, R.center / 2, [
                  `${dict.planets[asp.planet1]} ${meta.symbol} ${dict.planets[asp.planet2]}`,
                  `${dict.aspects[asp.type]} · ${dict.common.orb} ${asp.orb}°`,
                  asp.isApplying ? dict.common.applying : dict.common.separating,
                ]);
              }}
              onMouseLeave={() => {
                setHoverAspect(null);
                setTip(null);
              }}
            />
          </g>
        );
      })}

      {/* planets */}
      {chartData.planets.map((p) => {
        const r = radiusOf[p.planet];
        const g = pt(p.longitude, r);
        const tick1 = pt(p.longitude, R.house);
        const tick2 = pt(p.longitude, R.house - 7);
        const degTick1 = pt(p.longitude, R.signInner);
        const degTick2 = pt(p.longitude, R.signInner - 6);
        const isActive = active === p.planet;
        return (
          <g key={p.planet}>
            <line x1={tick1.x} y1={tick1.y} x2={tick2.x} y2={tick2.y} stroke="#E8C97A" strokeWidth="1" opacity="0.75" pointerEvents="none" />
            <line x1={degTick1.x} y1={degTick1.y} x2={degTick2.x} y2={degTick2.y} stroke="#E8C97A" strokeWidth="0.9" opacity="0.55" pointerEvents="none" />
            <circle
              cx={g.x} cy={g.y} r={15.5}
              fill={`url(#wplanet-${uid})`}
              stroke={isActive ? "#E8C97A" : "rgba(201,168,76,0.45)"}
              strokeWidth={isActive ? 1.2 : 0.6}
              filter={isActive ? `url(#wglowsoft-${uid})` : undefined}
              style={{ transition: "stroke 0.25s" }}
            />
            <text
              x={g.x} y={g.y}
              fontSize={isActive ? 18 : 16}
              fill={isActive ? "#E8C97A" : "#C9A84C"}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-display"
              pointerEvents="none"
              filter={isActive ? `url(#wglow-${uid})` : undefined}
            >
              {PLANET_GLYPHS[p.planet]}
            </text>
            {p.isRetrograde && (
              <text x={g.x + 12} y={g.y - 10} fontSize={8} fill="#E8A94C" textAnchor="middle" pointerEvents="none">
                ℞
              </text>
            )}
            <circle
              cx={g.x} cy={g.y} r={17}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => {
                setHoverPlanet(p.planet);
                onPlanetHover?.(p.planet);
                showTip(p.longitude, r, [
                  dict.planets[p.planet],
                  `${ZODIAC[Math.floor(norm360(p.longitude) / 30)].glyph} ${p.degree}°${String(p.minutes).padStart(2, "0")}'`,
                  `${dict.common.house} ${ROMAN[p.house - 1]}${p.isRetrograde ? " · ℞" : ""}`,
                ]);
              }}
              onMouseLeave={() => {
                setHoverPlanet(null);
                onPlanetHover?.(null);
                setTip(null);
              }}
              onClick={() => onPlanetClick?.(p)}
            />
          </g>
        );
      })}

      {/* angle markers: arrow + label */}
      {([["asc", "ASC"], ["mc", "MC"], ["dsc", "DSC"], ["ic", "IC"]] as const).map(([k, label]) => {
        const lon = chartData.angles[k];
        const tipPt = pt(lon, R.rim - 1);
        const b1 = pt(lon + 1.6, R.rim + 7);
        const b2 = pt(lon - 1.6, R.rim + 7);
        const lab = pt(lon, R.rim + 17);
        return (
          <g key={k} pointerEvents="none">
            <path d={`M ${tipPt.x} ${tipPt.y} L ${b1.x} ${b1.y} L ${b2.x} ${b2.y} Z`} fill="#E8C97A" opacity="0.9" />
            <text
              x={lab.x} y={lab.y}
              fontSize={11}
              fill="#E8C97A"
              textAnchor="middle"
              dominantBaseline="central"
              letterSpacing="0.18em"
              className="font-display"
            >
              {label}
            </text>
          </g>
        );
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
            fill="rgba(10,10,15,0.96)"
            stroke="rgba(201,168,76,0.5)"
            strokeWidth={0.6}
          />
          {tip.lines.map((line, i) => (
            <text
              key={i}
              x={tip.x + 20}
              y={tip.y - 4 - (tip.lines.length - 1 - i) * 14}
              fontSize={11}
              fill={i === 0 ? "#F0EDE8" : "#9B97A8"}
              className={i === 0 ? "font-display" : ""}
            >
              {line}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
