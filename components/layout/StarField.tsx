"use client";

import { useEffect, useId, useMemo, useRef } from "react";

interface StarFieldProps {
  density?: number;
  parallax?: boolean;
}

/**
 * Animated star field with mouse parallax + nebula glows + constellation lines.
 * Ported verbatim from the figma export (deterministic seeded star layout).
 */
export function StarField({ density = 140, parallax = true }: StarFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const gradId = `cline-${rawId.replace(/:/g, "")}`;

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

      {/* sparse constellation lines */}
      <svg className="absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="0" stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="0.5" stopColor="#C9A84C" stopOpacity="0.6" />
            <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke={`url(#${gradId})`} strokeWidth="0.5" fill="none">
          <polyline points="10%,20% 18%,28% 25%,22% 32%,35% 40%,30%" />
          <polyline points="70%,15% 78%,22% 85%,18% 92%,28%" />
          <polyline points="55%,70% 62%,78% 70%,72% 76%,85%" />
        </g>
      </svg>
    </div>
  );
}
