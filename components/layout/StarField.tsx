"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

interface StarFieldProps {
  density?: number;
  parallax?: boolean;
  /** Enables constellation hover (name reveal). Default off for backgrounds. */
  interactive?: boolean;
}

interface Constellation {
  name: { en: string; pt: string };
  /** Star coordinates in viewport percent. Index 0 may be the brightest. */
  stars: [number, number][];
  /** Index pairs into `stars` describing the traced figure. */
  lines: [number, number][];
  label: [number, number];
}

/* Hand-set star patterns — recognizable, not to scale. */
const CONSTELLATIONS: Constellation[] = [
  {
    name: { en: "Ursa Major", pt: "Ursa Maior" },
    stars: [[7, 20], [12, 18], [17, 20], [21, 25], [27, 24], [32, 28], [37, 25]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
    label: [21, 14],
  },
  {
    name: { en: "Cassiopeia", pt: "Cassiopeia" },
    stars: [[55, 8], [59, 13], [63, 9], [67, 14], [71, 10]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    label: [63, 4],
  },
  {
    name: { en: "Orion", pt: "Órion" },
    stars: [[41, 52], [49, 51], [43.4, 60], [45.2, 61.2], [47, 62.4], [40, 71], [50, 69]],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
    label: [45, 46],
  },
  {
    name: { en: "Lyra", pt: "Lira" },
    stars: [[79, 27], [81.5, 31], [85, 33], [83, 36.5], [79.5, 34.5]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]],
    label: [82, 22],
  },
  {
    name: { en: "Cygnus", pt: "Cisne" },
    stars: [[90, 52], [90, 60], [85.5, 57], [94.5, 56.5], [90, 68]],
    lines: [[0, 1], [1, 4], [2, 1], [1, 3]],
    label: [90, 46],
  },
  {
    name: { en: "Scorpius", pt: "Escorpião" },
    stars: [[9, 62], [12, 66], [14, 70], [15, 75], [17.5, 80], [21.5, 83.5], [26, 84], [29, 81.5]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
    label: [12, 57],
  },
  {
    name: { en: "Crux", pt: "Cruzeiro do Sul" },
    stars: [[68, 78], [70, 87], [65.5, 83.5], [72.5, 81]],
    lines: [[0, 1], [2, 3]],
    label: [69, 73],
  },
];

/**
 * Animated deep-sky background: seeded star field, nebula glows and real
 * constellation figures (glowing named stars). Mouse parallax; optional
 * hover-to-name interactivity for hero sections.
 */
export function StarField({ density = 140, parallax = true, interactive = false }: StarFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const gradId = `cline-${rawId.replace(/:/g, "")}`;
  const glowId = `cglow-${rawId.replace(/:/g, "")}`;
  const { locale } = useI18n();
  const [hovered, setHovered] = useState<number | null>(null);

  const stars = useMemo(() => {
    const rand = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    };
    const r = rand(42);
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      x: r() * 100,
      y: r() * 100,
      size: r() * 1.8 + 0.3,
      depth: r() * 3 + 1,
      delay: r() * 4,
      duration: r() * 3 + 2,
      bright: r() > 0.93,
    }));
  }, [density]);

  useEffect(() => {
    if (!parallax || !ref.current) return;
    const el = ref.current;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--mx", `${x}`);
      el.style.setProperty("--my", `${y}`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [parallax]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ ["--mx"]: 0, ["--my"]: 0 } as React.CSSProperties}
    >
      {/* nebula glows */}
      <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,#4A2D9E_0%,transparent_70%)] opacity-40 blur-[120px]" />
      <div className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,#1E3A5F_0%,transparent_70%)] opacity-30 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,#C9A84C_0%,transparent_70%)] opacity-20 blur-[120px]" />

      {stars.map((s) => (
        <div
          key={s.id}
          className="animate-twinkle absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.bright ? "#E8C97A" : "#F0EDE8",
            boxShadow: s.bright
              ? "0 0 6px rgba(232,201,122,0.8)"
              : "0 0 2px rgba(240,237,232,0.4)",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            transform: `translate(calc(var(--mx) * ${s.depth * 6}px), calc(var(--my) * ${s.depth * 6}px))`,
            transition: "transform 0.4s cubic-bezier(.2,.8,.2,1)",
          }}
        />
      ))}

      {/* constellations */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{
          transform: "translate(calc(var(--mx) * 4px), calc(var(--my) * 4px))",
          transition: "transform 0.4s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="0" stopColor="#C9A84C" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#C9A84C" stopOpacity="0.7" />
            <stop offset="1" stopColor="#C9A84C" stopOpacity="0.15" />
          </linearGradient>
          <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.35" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CONSTELLATIONS.map((c, ci) => {
          const active = hovered === ci;
          return (
            <g
              key={c.name.en}
              style={interactive ? { pointerEvents: "auto", cursor: "default" } : undefined}
              onMouseEnter={interactive ? () => setHovered(ci) : undefined}
              onMouseLeave={interactive ? () => setHovered(null) : undefined}
              opacity={active ? 1 : 0.55}
            >
              {/* wide invisible hit lines */}
              {interactive &&
                c.lines.map(([a, b], i) => (
                  <line
                    key={`h-${i}`}
                    x1={c.stars[a][0]} y1={c.stars[a][1]}
                    x2={c.stars[b][0]} y2={c.stars[b][1]}
                    stroke="transparent" strokeWidth={2.4}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              {c.lines.map(([a, b], i) => (
                <line
                  key={i}
                  x1={c.stars[a][0]} y1={c.stars[a][1]}
                  x2={c.stars[b][0]} y2={c.stars[b][1]}
                  stroke={`url(#${gradId})`}
                  strokeWidth={active ? 0.22 : 0.12}
                  filter={active ? `url(#${glowId})` : undefined}
                />
              ))}
              {c.stars.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x} cy={y}
                  r={i === 0 ? 0.42 : 0.3}
                  fill={active ? "#E8C97A" : "#D9C489"}
                  filter={`url(#${glowId})`}
                  className="animate-twinkle"
                  style={{ animationDelay: `${(ci * 0.7 + i * 0.35) % 4}s`, animationDuration: "4s" }}
                />
              ))}
              <text
                x={c.label[0]} y={c.label[1]}
                textAnchor="middle"
                fontSize="1.7"
                fill="#E8C97A"
                letterSpacing="0.4"
                opacity={active ? 0.95 : 0}
                style={{ transition: "opacity 0.35s", fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                {c.name[locale]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
