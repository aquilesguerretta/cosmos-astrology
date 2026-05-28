import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles, Moon, Sun, Heart, Briefcase, Activity, Hash,
  ChevronLeft, ChevronRight, Search, Send, Bell, Crown,
  LayoutGrid, Compass, BookOpen, Users, Settings, LogOut,
  MapPin, Calendar, Clock, Plus, Star, ArrowRight, Check,
  Lock, Download, Trash2, MoreHorizontal,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   PRIMITIVES — celestial iconography (SVG, line-art, gold)
   ───────────────────────────────────────────────────────────────────── */

const ZODIAC = [
  { key: "aries",       name: "Aries",       dates: "Mar 21 – Apr 19", element: "Fire",  glyph: "♈", planet: "Mars",    deg: 14 },
  { key: "taurus",      name: "Taurus",      dates: "Apr 20 – May 20", element: "Earth", glyph: "♉", planet: "Venus",   deg: 22 },
  { key: "gemini",      name: "Gemini",      dates: "May 21 – Jun 20", element: "Air",   glyph: "♊", planet: "Mercury", deg:  8 },
  { key: "cancer",      name: "Cancer",      dates: "Jun 21 – Jul 22", element: "Water", glyph: "♋", planet: "Moon",    deg: 19 },
  { key: "leo",         name: "Leo",         dates: "Jul 23 – Aug 22", element: "Fire",  glyph: "♌", planet: "Sun",     deg: 27 },
  { key: "virgo",       name: "Virgo",       dates: "Aug 23 – Sep 22", element: "Earth", glyph: "♍", planet: "Mercury", deg:  3 },
  { key: "libra",       name: "Libra",       dates: "Sep 23 – Oct 22", element: "Air",   glyph: "♎", planet: "Venus",   deg: 11 },
  { key: "scorpio",     name: "Scorpio",     dates: "Oct 23 – Nov 21", element: "Water", glyph: "♏", planet: "Pluto",   deg: 24 },
  { key: "sagittarius", name: "Sagittarius", dates: "Nov 22 – Dec 21", element: "Fire",  glyph: "♐", planet: "Jupiter", deg:  6 },
  { key: "capricorn",   name: "Capricorn",   dates: "Dec 22 – Jan 19", element: "Earth", glyph: "♑", planet: "Saturn",  deg: 18 },
  { key: "aquarius",    name: "Aquarius",    dates: "Jan 20 – Feb 18", element: "Air",   glyph: "♒", planet: "Uranus",  deg: 29 },
  { key: "pisces",      name: "Pisces",      dates: "Feb 19 – Mar 20", element: "Water", glyph: "♓", planet: "Neptune", deg:  2 },
];

const PLANETS = [
  { glyph: "☉", name: "Sun",     sign: "Leo",        signGlyph: "♌", deg: "12°47'", house: "X",    motion: "direct" },
  { glyph: "☽", name: "Moon",    sign: "Pisces",     signGlyph: "♓", deg: "03°12'", house: "V",    motion: "direct" },
  { glyph: "☿", name: "Mercury", sign: "Virgo",      signGlyph: "♍", deg: "28°04'", house: "XI",   motion: "retrograde" },
  { glyph: "♀", name: "Venus",   sign: "Libra",      signGlyph: "♎", deg: "16°33'", house: "I",    motion: "direct" },
  { glyph: "♂", name: "Mars",    sign: "Scorpio",    signGlyph: "♏", deg: "09°51'", house: "II",   motion: "direct" },
  { glyph: "♃", name: "Jupiter", sign: "Sagittarius",signGlyph: "♐", deg: "22°18'", house: "III",  motion: "direct" },
  { glyph: "♄", name: "Saturn",  sign: "Aquarius",   signGlyph: "♒", deg: "07°45'", house: "V",    motion: "retrograde" },
  { glyph: "♅", name: "Uranus",  sign: "Taurus",     signGlyph: "♉", deg: "19°02'", house: "VIII", motion: "direct" },
  { glyph: "♆", name: "Neptune", sign: "Pisces",     signGlyph: "♓", deg: "25°37'", house: "VI",   motion: "direct" },
  { glyph: "♇", name: "Pluto",   sign: "Capricorn",  signGlyph: "♑", deg: "29°10'", house: "IV",   motion: "direct" },
];

/* ─────────────────────────────────────────────────────────────────────
   STAR FIELD with parallax — generated once
   ───────────────────────────────────────────────────────────────────── */

function StarField({ density = 140, parallax = true }: { density?: number; parallax?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const stars = useMemo(() => {
    const rand = (seed: number) => {
      let s = seed;
      return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
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
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ ["--mx" as any]: 0, ["--my" as any]: 0 }}>
      {/* nebula glows */}
      <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full opacity-40 blur-[120px]"
           style={{ background: "radial-gradient(circle, #4A2D9E 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full opacity-30 blur-[140px]"
           style={{ background: "radial-gradient(circle, #1E3A5F 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-20 blur-[120px]"
           style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }} />

      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.bright ? "#E8C97A" : "#F0EDE8",
            boxShadow: s.bright ? "0 0 6px rgba(232,201,122,0.8)" : "0 0 2px rgba(240,237,232,0.4)",
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
          <linearGradient id="cline" x1="0" x2="1">
            <stop offset="0" stopColor="#C9A84C" stopOpacity="0" />
            <stop offset="0.5" stopColor="#C9A84C" stopOpacity="0.6" />
            <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="url(#cline)" strokeWidth="0.5" fill="none">
          <polyline points="10%,20% 18%,28% 25%,22% 32%,35% 40%,30%" />
          <polyline points="70%,15% 78%,22% 85%,18% 92%,28%" />
          <polyline points="55%,70% 62%,78% 70%,72% 76%,85%" />
        </g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SHARED ATOMS
   ───────────────────────────────────────────────────────────────────── */

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <span className="text-[var(--gold)]/60 text-xs">✦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
    </div>
  );
}

function GoldButton({
  children, className = "", onClick, variant = "primary",
}: { children: React.ReactNode; className?: string; onClick?: () => void; variant?: "primary" | "ghost" }) {
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--gold)]/40 text-[var(--gold-light)] hover:bg-[var(--gold)]/10 transition-all duration-300 ${className}`}
        style={{ fontFamily: "var(--font-body)", letterSpacing: "0.06em", fontSize: "0.8rem", textTransform: "uppercase" }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 overflow-hidden transition-all duration-500 ${className}`}
      style={{
        background: "linear-gradient(135deg, #E8C97A 0%, #C9A84C 50%, #9A7A2E 100%)",
        color: "#0A0A0F",
        fontFamily: "var(--font-body)",
        letterSpacing: "0.08em",
        fontSize: "0.8rem",
        textTransform: "uppercase",
        boxShadow: "0 0 0 1px rgba(232,201,122,0.4), 0 8px 32px rgba(201,168,76,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite",
        }}
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}

function GlassCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`glass relative ${className}`}
      style={glow ? { boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.18), inset 0 1px 0 rgba(255,255,255,0.04)" } : undefined}
    >
      {/* corner ornaments */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--gold)]/40" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--gold)]/40" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--gold)]/40" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--gold)]/40" />
      {children}
    </div>
  );
}

function DarkInput({
  label, placeholder, icon, value, onChange,
}: { label: string; placeholder?: string; icon?: React.ReactNode; value?: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block">{label}</span>
      <div className="group relative flex items-center gap-3 px-4 py-3 bg-white/[0.025] border border-[var(--gold)]/15 transition-all duration-300 focus-within:border-[var(--gold)]/50 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_24px_rgba(201,168,76,0.15)]">
        {icon && <span className="text-[var(--gold)]/70">{icon}</span>}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[var(--text-primary-color)] placeholder:text-[var(--text-muted-color)] text-sm tracking-wide"
        />
      </div>
    </label>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   NAV SIDEBAR
   ───────────────────────────────────────────────────────────────────── */

type PageKey = "landing" | "dashboard" | "chart" | "horoscope" | "compatibility" | "profile";

const NAV = [
  { key: "dashboard",      label: "Sanctum",        icon: LayoutGrid },
  { key: "chart",          label: "Natal Chart",    icon: Compass },
  { key: "horoscope",      label: "Daily Reading",  icon: BookOpen },
  { key: "compatibility",  label: "Synastry",       icon: Users },
  { key: "profile",        label: "The Self",       icon: Settings },
] as const;

function Sidebar({ page, setPage }: { page: PageKey; setPage: (p: PageKey) => void }) {
  return (
    <aside className="w-[260px] shrink-0 border-r border-[var(--gold)]/10 flex flex-col h-screen sticky top-0"
           style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(18,18,26,0.95) 100%)", backdropFilter: "blur(12px)" }}>
      {/* Brand */}
      <button onClick={() => setPage("landing")} className="px-7 pt-7 pb-6 border-b border-[var(--gold)]/10 text-left">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 22 22" className="text-[var(--gold)]">
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="11" cy="11" r="1.5" fill="currentColor" />
            <circle cx="17" cy="11" r="1" fill="currentColor" />
            <circle cx="11" cy="17" r="0.8" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="font-display text-2xl tracking-wide gold-text">Cosmos</span>
        </div>
        <p className="label-caps mt-1.5 text-[10px]">Est · MMXXVI</p>
      </button>

      {/* User card */}
      <div className="px-5 py-5 border-b border-[var(--gold)]/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[var(--purple-mid)] to-[var(--indigo-deep)] grid place-items-center text-[var(--gold-light)] text-xl font-display">A</div>
            <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full grid place-items-center text-[10px]"
                  style={{ background: "linear-gradient(135deg,#E8C97A,#9A7A2E)", color: "#0A0A0F" }}>♎</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-[var(--text-primary-color)] truncate">Anaïs Lune</p>
            <p className="text-[11px] text-[var(--text-secondary-color)] tracking-wider">Libra Sun · Pisces Moon</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="label-caps px-4 pb-3">Constellations</p>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = page === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key as PageKey)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-300 relative group ${
                active ? "text-[var(--gold-light)]" : "text-[var(--text-secondary-color)] hover:text-[var(--text-primary-color)]"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px]" style={{ background: "linear-gradient(180deg,#E8C97A,#9A7A2E)" }} />
              )}
              <Icon size={16} className={active ? "text-[var(--gold)]" : ""} strokeWidth={1.5} />
              <span style={{ letterSpacing: "0.04em" }}>{n.label}</span>
              {active && <span className="ml-auto text-[var(--gold)]/60 text-xs">✦</span>}
            </button>
          );
        })}
      </nav>

      {/* footer */}
      <div className="px-5 py-5 border-t border-[var(--gold)]/10 space-y-3">
        <div className="glass px-3 py-2.5 flex items-center gap-2.5">
          <Crown size={14} className="text-[var(--gold)]" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[var(--text-primary-color)]">Celestial Plan</p>
            <p className="text-[10px] text-[var(--text-muted-color)]">Renews 14 Jun</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[var(--text-muted-color)] hover:text-[var(--text-primary-color)] text-xs transition">
          <LogOut size={13} strokeWidth={1.5} /> Retire from session
        </button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   1. LANDING
   ───────────────────────────────────────────────────────────────────── */

function ZodiacWheelMark() {
  // decorative wheel for landing
  return (
    <div className="relative aspect-square w-full max-w-[540px] mx-auto">
      <div className="absolute inset-0 animate-orbit">
        <svg viewBox="0 0 400 400" className="h-full w-full">
          <defs>
            <radialGradient id="rg1" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#4A2D9E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="195" fill="url(#rg1)" />
          {/* outer ring */}
          <circle cx="200" cy="200" r="190" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.4" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.3" />
          <circle cx="200" cy="200" r="80"  fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.25" />
          {/* 12 spokes + glyphs */}
          {ZODIAC.map((z, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x1 = 200 + Math.cos(angle) * 160;
            const y1 = 200 + Math.sin(angle) * 160;
            const x2 = 200 + Math.cos(angle) * 190;
            const y2 = 200 + Math.sin(angle) * 190;
            const gx = 200 + Math.cos(angle + Math.PI / 12) * 175;
            const gy = 200 + Math.sin(angle + Math.PI / 12) * 175;
            return (
              <g key={z.key}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="0.4" opacity="0.5" />
                <text x={gx} y={gy} fontSize="14" fill="#C9A84C" textAnchor="middle" dominantBaseline="middle" opacity="0.9">{z.glyph}</text>
              </g>
            );
          })}
          {/* center motif */}
          <g transform="translate(200 200)">
            <circle r="40" fill="none" stroke="#E8C97A" strokeWidth="0.6" opacity="0.6" />
            <circle r="3" fill="#E8C97A" />
            <text y="6" fontSize="24" fill="#E8C97A" textAnchor="middle" opacity="0.0">☉</text>
          </g>
        </svg>
      </div>
      {/* counter-rotating inner planets */}
      <div className="absolute inset-[18%] animate-orbit" style={{ animationDuration: "40s", animationDirection: "reverse" }}>
        <svg viewBox="0 0 400 400" className="h-full w-full">
          {["☉","☽","♀","♂","♃","♄","♅"].map((g, i) => {
            const angle = (i / 7) * Math.PI * 2;
            const r = 130;
            const x = 200 + Math.cos(angle) * r;
            const y = 200 + Math.sin(angle) * r;
            return (
              <g key={g}>
                <circle cx={x} cy={y} r="14" fill="#0A0A0F" stroke="#C9A84C" strokeOpacity="0.5" strokeWidth="0.5" />
                <text x={x} y={y + 5} fontSize="14" fill="#E8C97A" textAnchor="middle">{g}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <p className="label-caps text-[var(--gold)]/80">Anno Stellarum</p>
          <p className="font-display text-6xl gold-text mt-2">XII</p>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ setPage }: { setPage: (p: PageKey) => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField density={180} />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 22 22" className="text-[var(--gold)]">
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="11" cy="11" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-display text-xl gold-text">Cosmos</span>
        </div>
        <nav className="hidden md:flex items-center gap-9 text-[13px] tracking-wide text-[var(--text-secondary-color)]">
          <a className="hover:text-[var(--gold-light)] transition">Atlas</a>
          <a className="hover:text-[var(--gold-light)] transition">Practitioners</a>
          <a className="hover:text-[var(--gold-light)] transition">Almanac</a>
          <a className="hover:text-[var(--gold-light)] transition">Membership</a>
        </nav>
        <button onClick={() => setPage("dashboard")} className="text-xs label-caps text-[var(--gold-light)] hover:text-[var(--gold)] flex items-center gap-2">
          Enter Sanctum <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero grid */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-16 px-12 pt-12 pb-24 max-w-[1440px] mx-auto items-center">
        {/* Left */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-[var(--gold)]/60" />
            <span className="label-caps text-[var(--gold-light)]">Vol. XIV · Equinox Edition</span>
          </div>

          <h1 className="font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-[var(--text-primary-color)]">
            Your <em className="font-italic-display text-[var(--gold-light)] font-light">cosmic</em>
            <br />
            blueprint
            <br />
            <span className="gold-text">awaits.</span>
          </h1>

          <p className="mt-8 max-w-md text-[var(--text-secondary-color)] text-[17px] leading-relaxed">
            Precision astrology drawn from two millennia of celestial observation —
            interpreted by master practitioners and a constellation-trained intelligence.
          </p>

          {/* Birth chart form */}
          <GlassCard className="mt-10 p-7 max-w-xl gold-border-glow">
            <div className="flex items-center justify-between mb-5">
              <p className="label-caps">Natal Inscription</p>
              <span className="text-[var(--gold)]/60 text-xs">✦ ✦ ✦</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DarkInput label="Date of birth" placeholder="14 · 03 · 1996" icon={<Calendar size={15} strokeWidth={1.4} />} />
              <DarkInput label="Hour" placeholder="04 : 27" icon={<Clock size={15} strokeWidth={1.4} />} />
            </div>
            <div className="mt-4">
              <DarkInput label="Place of arrival" placeholder="Lisbon, Portugal · 38.72°N 9.13°W" icon={<MapPin size={15} strokeWidth={1.4} />} />
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-[11px] text-[var(--text-muted-color)] max-w-[220px] leading-relaxed">
                Coordinates honored to the arcminute. Your data remains sealed.
              </p>
              <GoldButton onClick={() => setPage("chart")}>
                Reveal My Chart <ArrowRight size={14} />
              </GoldButton>
            </div>
          </GlassCard>

          {/* trust marks */}
          <div className="mt-10 flex items-center gap-8 text-[var(--text-muted-color)] text-[11px] tracking-[0.2em] uppercase">
            <span className="flex items-center gap-2"><Check size={12} className="text-[var(--gold)]" /> Swiss Ephemeris</span>
            <span className="flex items-center gap-2"><Check size={12} className="text-[var(--gold)]" /> Whole-sign & Placidus</span>
            <span className="flex items-center gap-2"><Check size={12} className="text-[var(--gold)]" /> 1.6M readings</span>
          </div>
        </div>

        {/* Right — wheel */}
        <div className="relative animate-float-slow">
          <ZodiacWheelMark />
        </div>
      </section>

      {/* Footer ribbon */}
      <Divider className="max-w-[1200px] mx-auto" />
      <div className="relative z-10 px-12 py-8 flex items-center justify-between max-w-[1440px] mx-auto text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted-color)]">
        <span>Lisbon · 38.7°N</span>
        <span>Mercury enters Virgo · IV days</span>
        <span>Waxing Gibbous · 87%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   2. DASHBOARD
   ───────────────────────────────────────────────────────────────────── */

function Dashboard({ setPage }: { setPage: (p: PageKey) => void }) {
  return (
    <div className="px-10 py-10 max-w-[1280px]">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-caps text-[var(--gold)]/80">Thursday · XXVI May MMXXVI</p>
          <h1 className="font-display text-5xl mt-2">Bem-vinda, <em className="font-italic-display text-[var(--gold-light)]">Anaïs</em></h1>
          <p className="text-[var(--text-secondary-color)] mt-2 text-sm tracking-wide">The Moon waxes in Virgo — a day for the careful tending of small things.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass h-10 w-10 grid place-items-center hover:border-[var(--gold)]/40 transition">
            <Search size={15} strokeWidth={1.5} className="text-[var(--text-secondary-color)]" />
          </button>
          <button className="glass h-10 w-10 grid place-items-center hover:border-[var(--gold)]/40 transition relative">
            <Bell size={15} strokeWidth={1.5} className="text-[var(--text-secondary-color)]" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          </button>
        </div>
      </div>

      {/* Today's cosmic overview */}
      <div className="relative overflow-hidden mb-10"
           style={{
             background: "linear-gradient(135deg, #1E3A5F 0%, #2D1B69 50%, #0A0A0F 100%)",
             border: "1px solid rgba(201,168,76,0.25)",
             boxShadow: "0 24px 80px rgba(45,27,105,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
           }}>
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <StarField density={60} parallax={false} />
        </div>
        <div className="absolute -right-20 -top-20 h-[340px] w-[340px] opacity-30">
          <div className="h-full w-full rounded-full border border-[var(--gold)]/40 animate-orbit" style={{ animationDuration: "120s" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[var(--gold-light)] shadow-[0_0_20px_rgba(232,201,122,0.8)]" />
          </div>
        </div>

        <div className="relative p-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
          <div>
            <p className="label-caps text-[var(--gold-light)]">Today's Cosmic Overview</p>
            <h2 className="font-display text-4xl mt-3 leading-tight">
              "The river finds its course not by force,<br/>but by listening to the land."
            </h2>
            <p className="text-[var(--text-secondary-color)] mt-5 text-sm leading-relaxed max-w-md">
              With the Moon in Virgo trine your natal Mercury, your discernment is unusually clear. A conversation
              begun this morning will reveal its true shape by dusk. Mars in Scorpio asks — what are you
              actually defending?
            </p>
            <div className="flex items-center gap-4 mt-7">
              <GoldButton onClick={() => setPage("horoscope")}>Full reading <ArrowRight size={14} /></GoldButton>
              <button className="text-xs label-caps text-[var(--text-secondary-color)] hover:text-[var(--gold-light)]">Listen · IV min</button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-baseline justify-between">
              <p className="label-caps">Auspicious score</p>
              <p className="font-display text-3xl gold-text">87 / 100</p>
            </div>
            <div className="h-px bg-[var(--gold)]/15" />
            {[
              { k: "Love",    v: 82, color: "from-[#E8A4C9] to-[#C9A84C]" },
              { k: "Vocation",v: 91, color: "from-[#7AC9E8] to-[#C9A84C]" },
              { k: "Body",    v: 76, color: "from-[#A4E8C9] to-[#C9A84C]" },
              { k: "Spirit",  v: 94, color: "from-[#C9A4E8] to-[#C9A84C]" },
            ].map((r) => (
              <div key={r.k}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[var(--text-secondary-color)] tracking-wider uppercase">{r.k}</span>
                  <span className="text-[var(--gold-light)]">{r.v}</span>
                </div>
                <div className="h-[3px] bg-white/5 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${r.color}`} style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Planetary positions */}
      <div className="mb-10">
        <div className="flex items-end justify-between mb-5">
          <h3 className="font-display text-2xl text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>Planetary positions, this moment</h3>
          <p className="label-caps">26 May · 14:42 WEST</p>
        </div>
        <GlassCard className="p-2">
          <div className="grid grid-cols-5 lg:grid-cols-10 divide-x divide-[var(--gold)]/10">
            {PLANETS.map((p) => (
              <div key={p.name} className="px-4 py-5 text-center group hover:bg-white/[0.02] transition">
                <p className="font-display text-3xl text-[var(--gold-light)] group-hover:text-[var(--gold)] transition">{p.glyph}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted-color)] mt-2">{p.name}</p>
                <p className="text-sm text-[var(--text-primary-color)] mt-1">{p.signGlyph}<span className="text-[var(--text-secondary-color)] text-[11px] ml-1">{p.deg}</span></p>
                {p.motion === "retrograde" && <p className="text-[9px] text-[var(--warning)] tracking-widest mt-1">℞</p>}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 4 cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Daily Horoscope",  caption: "Today's reading for Libra", icon: BookOpen, page: "horoscope", accent: "♎" },
          { title: "Weekly Forecast",  caption: "26 May → 1 Jun",            icon: Calendar, page: "horoscope", accent: "✦" },
          { title: "Birth Chart",      caption: "Natal map · 31 aspects",    icon: Compass,  page: "chart",     accent: "☉" },
          { title: "Compatibility",    caption: "Synastry with another",     icon: Users,    page: "compatibility", accent: "♀♂" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.title}
              onClick={() => setPage(c.page as PageKey)}
              className="glass relative p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(201,168,76,0.18)] group"
            >
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--gold)]/40" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--gold)]/40" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--gold)]/40" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--gold)]/40" />
              <div className="flex items-start justify-between mb-8">
                <div className="h-9 w-9 grid place-items-center border border-[var(--gold)]/30 text-[var(--gold)] group-hover:border-[var(--gold)] transition">
                  <Icon size={15} strokeWidth={1.4} />
                </div>
                <span className="text-[var(--gold-light)] text-xl font-display">{c.accent}</span>
              </div>
              <p className="font-display text-2xl text-[var(--text-primary-color)]">{c.title}</p>
              <p className="text-xs text-[var(--text-secondary-color)] mt-2 tracking-wide">{c.caption}</p>
              <div className="mt-6 flex items-center gap-2 text-[var(--gold-light)] text-xs label-caps">
                Enter <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   3. BIRTH CHART
   ───────────────────────────────────────────────────────────────────── */

function NatalWheel() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="relative aspect-square w-full">
      <svg viewBox="0 0 600 600" className="h-full w-full">
        <defs>
          <radialGradient id="bg" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="#2D1B69" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#1E3A5F" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="290" fill="url(#bg)" />
        {/* outermost ring */}
        <circle cx="300" cy="300" r="280" fill="none" stroke="#C9A84C" strokeWidth="0.6" opacity="0.7" />
        <circle cx="300" cy="300" r="240" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.5" />
        <circle cx="300" cy="300" r="210" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.3" />
        <circle cx="300" cy="300" r="120" fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.25" />
        <circle cx="300" cy="300" r="60"  fill="none" stroke="#C9A84C" strokeWidth="0.3" opacity="0.25" />

        {/* degree ticks */}
        {Array.from({ length: 360 }).map((_, i) => {
          const a = (i / 360) * Math.PI * 2 - Math.PI / 2;
          const r1 = i % 30 === 0 ? 260 : i % 10 === 0 ? 270 : 275;
          const r2 = 280;
          const x1 = 300 + Math.cos(a) * r1;
          const y1 = 300 + Math.sin(a) * r1;
          const x2 = 300 + Math.cos(a) * r2;
          const y2 = 300 + Math.sin(a) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth={i % 30 === 0 ? 0.8 : 0.3} opacity={i % 30 === 0 ? 0.8 : 0.35} />;
        })}

        {/* 12 houses */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a1 = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
          const am = (a1 + a2) / 2;
          const x1 = 300 + Math.cos(a1) * 240;
          const y1 = 300 + Math.sin(a1) * 240;
          const x2 = 300 + Math.cos(a1) * 60;
          const y2 = 300 + Math.sin(a1) * 60;
          // wedge path for hover
          const ax1 = 300 + Math.cos(a1) * 60,  ay1 = 300 + Math.sin(a1) * 60;
          const ax2 = 300 + Math.cos(a2) * 60,  ay2 = 300 + Math.sin(a2) * 60;
          const bx1 = 300 + Math.cos(a1) * 240, by1 = 300 + Math.sin(a1) * 240;
          const bx2 = 300 + Math.cos(a2) * 240, by2 = 300 + Math.sin(a2) * 240;
          const path = `M ${ax1} ${ay1} L ${bx1} ${by1} A 240 240 0 0 1 ${bx2} ${by2} L ${ax2} ${ay2} A 60 60 0 0 0 ${ax1} ${ay1} Z`;
          const lx = 300 + Math.cos(am) * 150;
          const ly = 300 + Math.sin(am) * 150;
          const gx = 300 + Math.cos(am) * 225;
          const gy = 300 + Math.sin(am) * 225;
          const roman = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][i];
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <path d={path} fill={hover === i ? "rgba(201,168,76,0.08)" : "transparent"} stroke="transparent" />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="0.4" opacity="0.5" />
              <text x={lx} y={ly + 4} fontSize="11" fill="#9B97A8" textAnchor="middle" letterSpacing="0.1em">{roman}</text>
              <text x={gx} y={gy + 6} fontSize="16" fill="#C9A84C" textAnchor="middle" opacity="0.85">{ZODIAC[i].glyph}</text>
            </g>
          );
        })}

        {/* aspect lines (interior) */}
        <g stroke="#C9A84C" fill="none" opacity="0.5">
          <line x1="180" y1="180" x2="420" y2="420" strokeWidth="0.5" />
          <line x1="180" y1="180" x2="430" y2="320" strokeWidth="0.4" stroke="#E85C4C" opacity="0.6" />
          <line x1="200" y1="380" x2="400" y2="220" strokeWidth="0.5" stroke="#4CAF82" opacity="0.6" />
          <line x1="240" y1="200" x2="360" y2="400" strokeWidth="0.4" />
          <line x1="180" y1="300" x2="420" y2="300" strokeWidth="0.4" stroke="#7AC9E8" opacity="0.5" />
        </g>

        {/* planet markers — sample placements */}
        {[
          { glyph: "☉", a: 1.3, r: 195, c: "#E8C97A" },
          { glyph: "☽", a: 2.4, r: 195, c: "#F0EDE8" },
          { glyph: "☿", a: 0.9, r: 195, c: "#7AC9E8" },
          { glyph: "♀", a: 3.1, r: 195, c: "#E8A4C9" },
          { glyph: "♂", a: 4.0, r: 195, c: "#E85C4C" },
          { glyph: "♃", a: 5.1, r: 195, c: "#C9A84C" },
          { glyph: "♄", a: 5.7, r: 195, c: "#9B97A8" },
          { glyph: "♅", a: 0.3, r: 195, c: "#A4E8C9" },
          { glyph: "♆", a: 2.0, r: 195, c: "#C9A4E8" },
          { glyph: "♇", a: 4.6, r: 195, c: "#E85C4C" },
        ].map((p, i) => {
          const x = 300 + Math.cos(p.a) * p.r;
          const y = 300 + Math.sin(p.a) * p.r;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="#0A0A0F" stroke={p.c} strokeWidth="0.7" />
              <text x={x} y={y + 5} fontSize="14" fill={p.c} textAnchor="middle">{p.glyph}</text>
            </g>
          );
        })}

        {/* center */}
        <g transform="translate(300 300)">
          <circle r="3" fill="#E8C97A" />
          <text y="-12" fontSize="9" fill="#9B97A8" textAnchor="middle" letterSpacing="0.2em">ASC</text>
        </g>

        {/* ASC marker line */}
        <line x1="20" y1="300" x2="60" y2="300" stroke="#E8C97A" strokeWidth="1" />
        <text x="42" y="294" fontSize="10" fill="#E8C97A" textAnchor="middle" letterSpacing="0.2em">ASC</text>
      </svg>
    </div>
  );
}

function BirthChartPage() {
  const [expand, setExpand] = useState<string | null>("Sun");
  return (
    <div className="px-10 py-10 max-w-[1400px]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="label-caps text-[var(--gold)]/80">Natal Inscription</p>
          <h1 className="font-display text-5xl mt-2">The Chart of <em className="font-italic-display text-[var(--gold-light)]">Anaïs Lune</em></h1>
          <p className="text-[var(--text-secondary-color)] mt-2 text-sm tracking-wide">14 March 1996 · 04:27 WET · Lisbon, 38.72°N · 9.13°W</p>
        </div>
        <div className="flex items-center gap-2">
          <GoldButton variant="ghost"><Download size={13} /> Export</GoldButton>
          <GoldButton>Reinterpret <Sparkles size={13} /></GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-8">
        {/* Wheel */}
        <GlassCard className="p-6">
          <NatalWheel />
          {/* legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#4CAF82]" /> Trine</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#E85C4C]" /> Square</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#7AC9E8]" /> Opposition</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#C9A84C]" /> Conjunction</span>
          </div>
        </GlassCard>

        {/* Right column */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="label-caps">Placements</p>
              <p className="text-[10px] text-[var(--text-muted-color)] tracking-widest">Placidus · Tropical</p>
            </div>
            <div className="space-y-px">
              {PLANETS.map((p) => (
                <div key={p.name} className="grid grid-cols-[28px_1fr_60px_70px_40px] items-center gap-3 px-2 py-2.5 hover:bg-white/[0.025] transition group">
                  <span className="font-display text-xl text-[var(--gold-light)]">{p.glyph}</span>
                  <span className="text-sm text-[var(--text-primary-color)]">{p.name}</span>
                  <span className="text-sm"><span className="text-[var(--gold)] mr-1">{p.signGlyph}</span><span className="text-[var(--text-secondary-color)] text-xs">{p.sign}</span></span>
                  <span className="text-xs text-[var(--text-secondary-color)] tabular-nums">{p.deg}</span>
                  <span className="text-[10px] text-[var(--text-muted-color)] text-right tracking-widest">{p.house}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Aspect grid */}
          <GlassCard className="p-6">
            <p className="label-caps mb-4">Aspect Matrix</p>
            <div className="overflow-x-auto">
              <table className="text-xs w-full">
                <thead>
                  <tr className="text-[var(--text-muted-color)] text-[10px] uppercase tracking-widest">
                    <th className="text-left pb-2"></th>
                    {["☉","☽","☿","♀","♂","♃","♄"].map((g) => <th key={g} className="font-normal pb-2 text-center">{g}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {["☉","☽","☿","♀","♂","♃","♄"].map((row, ri) => (
                    <tr key={row} className="border-t border-[var(--gold)]/8">
                      <td className="py-2 text-[var(--gold-light)] font-display text-base">{row}</td>
                      {["☉","☽","☿","♀","♂","♃","♄"].map((col, ci) => {
                        if (ri === ci) return <td key={ci} className="text-center text-[var(--text-muted-color)]">·</td>;
                        if (ri > ci) return <td key={ci} className="text-center text-[var(--text-muted-color)]/30">—</td>;
                        const aspects = ["△","□","☌","✶","☍","△","□","✶","☌","△","□","✶","☍","△","☌","□","✶","△","☍","✶","☌"];
                        const colors  = ["#4CAF82","#E85C4C","#C9A84C","#7AC9E8","#E8A4C9","#4CAF82","#E85C4C","#7AC9E8","#C9A84C","#4CAF82","#E85C4C","#7AC9E8","#E8A4C9","#4CAF82","#C9A84C","#E85C4C","#7AC9E8","#4CAF82","#E8A4C9","#7AC9E8","#C9A84C"];
                        const idx = (ri * 7 + ci) % aspects.length;
                        return <td key={ci} className="text-center py-2"><span style={{ color: colors[idx] }}>{aspects[idx]}</span></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI interpretation */}
      <section className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={14} className="text-[var(--gold)]" />
          <h3 className="font-display text-2xl" style={{ fontWeight: 400 }}>The Interpretation</h3>
          <span className="label-caps text-[var(--text-muted-color)] ml-auto">Composed by Astra · MMXXVI</span>
        </div>

        <div className="space-y-3">
          {[
            { name: "Sun in Pisces, V house", body: "The Sun, the seat of your essential vitality, falls in watery Pisces — the sign of dissolved boundaries, dream-logic, and devotion. Placed in the fifth house of creative expression and the heart's wager, it speaks to a life whose center is found not in argument but in song, image, and tenderness. You are most yourself when you are making something." },
            { name: "Moon in Virgo, XI house", body: "Your emotional waters are kept in vessels of careful porcelain. The Virgo Moon needs order and small daily rituals to feel safe — a swept threshold, a clean teacup. In the eleventh house, this discernment is given to friendships and the company you keep; you can spot the false note in a room before anyone speaks." },
            { name: "Mercury in Aquarius, IV house", body: "Mind set apart, mind that thinks in systems and unlikely connections. Aquarian Mercury at the foundation of the chart — the family of origin, the inner room — suggests an intellectual atmosphere at home, or a longing to remake home into a place of free thinking." },
            { name: "Venus in Aries, VI house", body: "Love is direct and a little impatient. You want the spark, the move first; subtlety wearies you. In the sixth house of daily work and the body, Venus asks that beauty be incorporated into the routine — the well-cut coat, the considered meal, the workspace that pleases the eye." },
          ].map((s) => (
            <GlassCard key={s.name} className="p-5">
              <button onClick={() => setExpand(expand === s.name ? null : s.name)} className="w-full flex items-center justify-between text-left">
                <span className="font-display text-lg text-[var(--text-primary-color)]">{s.name}</span>
                <span className="text-[var(--gold)]/70 text-xs">{expand === s.name ? "—" : "+"}</span>
              </button>
              {expand === s.name && (
                <p className="mt-4 text-[var(--text-secondary-color)] text-[15px] leading-[1.75] animate-fade-up" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
                  {s.body}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   4. DAILY HOROSCOPE
   ───────────────────────────────────────────────────────────────────── */

const PREVIEWS: Record<string, string> = {
  aries:       "A door that resisted yields. Lean once more.",
  taurus:      "Return to what you already know is true.",
  gemini:      "Two messages, one of them worth keeping.",
  cancer:      "The home you tend is tending you back.",
  leo:         "Be photographed; let the light find you.",
  virgo:       "Permit a small disorder; something will bloom.",
  libra:       "An old equation rebalances of its own accord.",
  scorpio:     "Speak the unspoken — quietly, but speak it.",
  sagittarius: "Buy the ticket; the journey already began.",
  capricorn:   "The plinth is set. Place the stone.",
  aquarius:    "A stranger's question is the one you needed.",
  pisces:      "Trust the mood; it is older than the day.",
};

function HoroscopePage() {
  const [selected, setSelected] = useState("libra");
  const z = ZODIAC.find((x) => x.key === selected)!;
  return (
    <div className="px-10 py-10 max-w-[1280px]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="label-caps text-[var(--gold)]/80">The Daily Reading</p>
          <h1 className="font-display text-5xl mt-2">Twelve voices, <em className="font-italic-display text-[var(--gold-light)]">one sky</em></h1>
        </div>
        <div className="flex items-center gap-1 glass px-2 py-1">
          <button className="h-8 w-8 grid place-items-center text-[var(--text-secondary-color)] hover:text-[var(--gold-light)]"><ChevronLeft size={16} /></button>
          <span className="px-4 text-sm tracking-wide text-[var(--text-primary-color)]">Thu · 26 May</span>
          <button className="h-8 w-8 grid place-items-center text-[var(--text-secondary-color)] hover:text-[var(--gold-light)]"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Zodiac grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
        {ZODIAC.map((zod) => {
          const active = zod.key === selected;
          return (
            <button
              key={zod.key}
              onClick={() => setSelected(zod.key)}
              className={`group relative p-4 text-left transition-all duration-300 ${
                active ? "bg-gradient-to-br from-[var(--purple-deep)]/40 to-transparent" : "hover:-translate-y-0.5"
              }`}
              style={{
                border: active ? "1px solid rgba(201,168,76,0.5)" : "1px solid rgba(201,168,76,0.12)",
                boxShadow: active ? "0 0 24px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.04)" : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`font-display text-3xl ${active ? "text-[var(--gold)]" : "text-[var(--gold-light)]/80 group-hover:text-[var(--gold)]"}`}>{zod.glyph}</span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">{zod.element}</span>
              </div>
              <p className="font-display text-lg text-[var(--text-primary-color)]">{zod.name}</p>
              <p className="text-[11px] text-[var(--text-muted-color)] mt-0.5">{zod.dates}</p>
              <p className="text-[12px] text-[var(--text-secondary-color)] mt-3 leading-snug italic" style={{ fontFamily: "var(--font-display)" }}>
                {PREVIEWS[zod.key]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected reading */}
      <GlassCard className="p-10" glow>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          <div>
            <div className="relative h-44 w-44 mx-auto grid place-items-center">
              <div className="absolute inset-0 rounded-full border border-[var(--gold)]/30" />
              <div className="absolute inset-3 rounded-full border border-[var(--gold)]/20" />
              <span className="font-display text-[7rem] gold-text leading-none">{z.glyph}</span>
            </div>
            <p className="font-display text-3xl text-center mt-3">{z.name}</p>
            <p className="text-center text-xs label-caps mt-1">{z.dates}</p>
            <div className="mt-6 space-y-2 text-xs text-[var(--text-secondary-color)]">
              <div className="flex justify-between border-b border-[var(--gold)]/10 pb-2"><span className="label-caps">Element</span><span>{z.element}</span></div>
              <div className="flex justify-between border-b border-[var(--gold)]/10 pb-2"><span className="label-caps">Ruler</span><span>{z.planet}</span></div>
              <div className="flex justify-between border-b border-[var(--gold)]/10 pb-2"><span className="label-caps">Quality</span><span>Cardinal</span></div>
              <div className="flex justify-between"><span className="label-caps">Modality</span><span>Air</span></div>
            </div>
          </div>

          <div>
            <p className="label-caps text-[var(--gold)]/80">Today's reading</p>
            <h2 className="font-display text-4xl mt-2 leading-tight">
              "The scale you have been holding<br />sets itself down."
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7 mt-8">
              {[
                { k: "Love", icon: Heart, body: "Venus, your patron, exits an awkward square and a conversation that felt held in suspense finally lands. If partnered, the air clears by evening. If unpartnered — an introduction through a sibling or neighbour merits more attention than first appears." },
                { k: "Vocation", icon: Briefcase, body: "A small administrative knot you have been avoiding releases with a single phone call. Make it before noon. The afternoon is for the larger work — drafting, designing, the slow craft." },
                { k: "Body", icon: Activity, body: "Lower back, hips, the kidneys. Water and a long walk after sundown. Avoid the third coffee; you do not actually need it today." },
                { k: "Lucky Numerals", icon: Hash, body: "VI · XIV · XXII", numbers: true },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.k}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Icon size={13} className="text-[var(--gold)]" strokeWidth={1.5} />
                      <span className="label-caps text-[var(--gold-light)]">{s.k}</span>
                    </div>
                    <p
                      className={s.numbers ? "font-display text-3xl gold-text tracking-widest" : "text-[var(--text-secondary-color)] text-[15px] leading-[1.75]"}
                      style={!s.numbers ? { fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" } : undefined}
                    >
                      {s.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ask the stars */}
        <div className="mt-10 pt-8 border-t border-[var(--gold)]/15">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={14} className="text-[var(--gold)]" />
            <p className="label-caps">Ask the Stars</p>
            <span className="text-[10px] text-[var(--text-muted-color)] ml-auto">A personal divination. III left today.</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.025] border border-[var(--gold)]/15 focus-within:border-[var(--gold)]/50 transition">
            <input
              className="flex-1 bg-transparent outline-none text-[var(--text-primary-color)] placeholder:text-[var(--text-muted-color)] text-[15px]"
              placeholder="Should I take the meeting on Friday?"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            />
            <button className="h-9 w-9 grid place-items-center bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-[#0A0A0F] hover:opacity-90 transition">
              <Send size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   5. COMPATIBILITY (SYNASTRY)
   ───────────────────────────────────────────────────────────────────── */

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
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

function PersonPanel({ name, sign, glyph, planets }: { name: string; sign: string; glyph: string; planets: string[] }) {
  return (
    <GlassCard className="p-7">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full grid place-items-center font-display text-3xl text-[var(--gold-light)]"
               style={{ background: "linear-gradient(135deg, #2D1B69, #1E3A5F)", border: "1px solid rgba(201,168,76,0.3)" }}>
            {name[0]}
          </div>
          <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full grid place-items-center text-xs"
                style={{ background: "linear-gradient(135deg,#E8C97A,#9A7A2E)", color: "#0A0A0F" }}>{glyph}</span>
        </div>
        <div>
          <p className="font-display text-2xl">{name}</p>
          <p className="text-xs text-[var(--text-secondary-color)] tracking-wider">{sign} Sun</p>
        </div>
      </div>
      <div className="space-y-3">
        <DarkInput label="Date of birth" placeholder="—" icon={<Calendar size={14} strokeWidth={1.4} />} value={name === "Anaïs" ? "14 · 03 · 1996" : "22 · 07 · 1993"} />
        <DarkInput label="Hour" placeholder="—" icon={<Clock size={14} strokeWidth={1.4} />} value={name === "Anaïs" ? "04 : 27" : "18 : 14"} />
        <DarkInput label="Place" placeholder="—" icon={<MapPin size={14} strokeWidth={1.4} />} value={name === "Anaïs" ? "Lisbon, PT" : "Marseille, FR"} />
      </div>
      <div className="mt-6 pt-5 border-t border-[var(--gold)]/15">
        <p className="label-caps mb-3">Luminaries & inner planets</p>
        <div className="flex flex-wrap gap-2">
          {planets.map((p, i) => (
            <span key={i} className="px-2.5 py-1 text-[11px] tracking-wider border border-[var(--gold)]/20 text-[var(--text-secondary-color)]">
              <span className="text-[var(--gold-light)] mr-1">{p.split(" ")[0]}</span>{p.split(" ")[1]}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function CompatibilityPage() {
  return (
    <div className="px-10 py-10 max-w-[1280px]">
      <div className="mb-10">
        <p className="label-caps text-[var(--gold)]/80">The Art of Synastry</p>
        <h1 className="font-display text-5xl mt-2">Two charts, <em className="font-italic-display text-[var(--gold-light)]">one weather</em></h1>
        <p className="text-[var(--text-secondary-color)] mt-2 text-sm tracking-wide max-w-lg">The cosmos does not measure love in stars, only in how the planets choose to speak when placed beside each other.</p>
      </div>

      {/* Triptych */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_1fr] gap-6 items-center">
        <PersonPanel
          name="Anaïs"
          sign="Pisces"
          glyph="♓"
          planets={["☉ Pisces", "☽ Virgo", "♀ Aries", "♂ Aquarius", "☿ Aquarius"]}
        />

        {/* Center — score & arc */}
        <div className="relative flex flex-col items-center justify-center py-8">
          {/* connecting arcs */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="arc1" x1="0" x2="1">
                <stop offset="0" stopColor="#E8C97A" stopOpacity="0" />
                <stop offset="0.5" stopColor="#E8C97A" stopOpacity="0.8" />
                <stop offset="1" stopColor="#E8C97A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M -10 80 Q 140 20 290 80" fill="none" stroke="url(#arc1)" strokeWidth="0.8" />
            <path d="M -10 240 Q 140 300 290 240" fill="none" stroke="url(#arc1)" strokeWidth="0.8" />
            <path d="M -10 160 Q 140 100 290 160" fill="none" stroke="url(#arc1)" strokeWidth="0.4" opacity="0.5" />
            <path d="M -10 160 Q 140 220 290 160" fill="none" stroke="url(#arc1)" strokeWidth="0.4" opacity="0.5" />
          </svg>

          <div className="relative h-56 w-56 grid place-items-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="3" />
              <circle cx="100" cy="100" r="90" fill="none" stroke="url(#ringg)" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${(83 / 100) * 565.5} 565.5`} />
              <defs>
                <linearGradient id="ringg" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#E8C97A" />
                  <stop offset="1" stopColor="#9A7A2E" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <p className="label-caps text-[var(--gold)]/80">Resonance</p>
              <p className="font-display text-6xl gold-text mt-1"><CountUp to={83} /><span className="text-2xl">%</span></p>
              <p className="text-[10px] text-[var(--text-muted-color)] tracking-[0.2em] uppercase mt-1">harmonious aspects · IX of XII</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[var(--gold-light)] text-sm" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            <span className="text-[var(--gold)]">✦</span> A grand trine in water <span className="text-[var(--gold)]">✦</span>
          </div>
        </div>

        <PersonPanel
          name="Élias"
          sign="Cancer"
          glyph="♋"
          planets={["☉ Cancer", "☽ Scorpio", "♀ Leo", "♂ Libra", "☿ Cancer"]}
        />
      </div>

      {/* Aspect cards */}
      <div className="mt-14">
        <Divider className="mb-8" />
        <h3 className="font-display text-2xl mb-6" style={{ fontWeight: 400 }}>The Inter-aspects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { pair: "☉ ⟷ ☉",   title: "Sun trine Sun",      kind: "Trine",       score: 92, color: "#4CAF82", body: "Two suns that warm without burning. Your essential rhythms — sleep, work, devotion — fall into easy phase. The kind of pairing where silence is not a problem to be solved." },
            { pair: "☽ ⟷ ☽",   title: "Moon sextile Moon",   kind: "Sextile",     score: 78, color: "#7AC9E8", body: "Both moons in water sing the same song in different octaves. Emotional weather passes through the household with little friction. Each understands the other's need to retreat." },
            { pair: "♀ ⟷ ♂",   title: "Venus square Mars",   kind: "Square",      score: 64, color: "#E85C4C", body: "Heat. The Venus-Mars square is a creative friction that can build a house or burn one down. Erotic charge is reliable. Disagreement comes quickly, repair faster." },
            { pair: "☿ ⟷ ☿",   title: "Mercury conj. Mercury",kind: "Conjunction", score: 88, color: "#C9A84C", body: "You finish each other's sentences in three languages. The conversational pace is similar; you can spend a whole evening on one idea without exhausting it." },
            { pair: "♃ ⟷ ☉",   title: "Jupiter trine Sun",   kind: "Trine",       score: 86, color: "#4CAF82", body: "Jupiter enlarges what it touches. Élias's Jupiter falling on Anaïs's Sun signals a partner who genuinely wants you bigger — more visible, more taken seriously, less apologetic." },
            { pair: "♄ ⟷ ☽",   title: "Saturn opp. Moon",    kind: "Opposition",  score: 52, color: "#E8A94C", body: "The challenging one. Saturn can chill the Moon. When you feel emotional and he goes silent — this is the wire that is humming. Name it aloud and the spell breaks." },
          ].map((a) => (
            <GlassCard key={a.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-2xl text-[var(--gold-light)]">{a.pair}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 border" style={{ color: a.color, borderColor: a.color + "55" }}>{a.kind}</span>
              </div>
              <p className="font-display text-xl text-[var(--text-primary-color)]">{a.title}</p>
              <div className="mt-4 h-[3px] bg-white/5">
                <div className="h-full" style={{ width: `${a.score}%`, background: `linear-gradient(90deg, ${a.color}, #C9A84C)` }} />
              </div>
              <p className="text-xs text-[var(--text-muted-color)] mt-1.5 tracking-widest">{a.score} of 100</p>
              <p className="mt-4 text-[var(--text-secondary-color)] text-[14px] leading-relaxed">{a.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Strengths / Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <GlassCard className="p-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--success)] text-lg">✦</span>
            <p className="label-caps text-[var(--success)]">The Strengths</p>
          </div>
          <ul className="space-y-3 text-[15px] text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px" }}>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>A shared instinct for the long, slow conversation.</li>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>Mutual respect for solitude — neither suffocates the other.</li>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>Aesthetic alignment: you would buy the same painting.</li>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>A grand water trine that holds the relationship in soft hands.</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[var(--warning)] text-lg">△</span>
            <p className="label-caps text-[var(--warning)]">The Edges</p>
          </div>
          <ul className="space-y-3" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "17px", color: "var(--text-primary-color)" }}>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>Saturn's chill on the Moon will recur at lunar returns.</li>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>Mars in Libra prefers indirection — name what you want.</li>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>Financial language differs — agree the ledger early.</li>
            <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">·</span>One of you will always pack last; accept it.</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   6. PROFILE / SETTINGS
   ───────────────────────────────────────────────────────────────────── */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 transition-all duration-300 ${on ? "bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold-dark)]" : "bg-white/10"}`}
      style={{ borderRadius: 999 }}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#0A0A0F] border border-[var(--gold)]/40 transition-all duration-300 ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

function ProfilePage() {
  const [notif, setNotif] = useState({ daily: true, weekly: true, transit: false, email: true, push: false });
  const [chart, setChart] = useState("anais");
  return (
    <div className="px-10 py-10 max-w-[1280px]">
      <div className="mb-10">
        <p className="label-caps text-[var(--gold)]/80">The Self in the Glass</p>
        <h1 className="font-display text-5xl mt-2">Your <em className="font-italic-display text-[var(--gold-light)]">inscription</em></h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          {/* Natal data card */}
          <GlassCard className="p-8" glow>
            <div className="flex items-center justify-between mb-6">
              <p className="label-caps">Natal data</p>
              <button className="text-xs text-[var(--gold-light)] hover:text-[var(--gold)] label-caps">Edit</button>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full grid place-items-center font-display text-5xl text-[var(--gold-light)]"
                     style={{ background: "linear-gradient(135deg, #2D1B69, #1E3A5F)", border: "1px solid rgba(201,168,76,0.4)", boxShadow: "0 0 32px rgba(77,45,158,0.4)" }}>
                  A
                </div>
                <span className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full grid place-items-center text-lg"
                      style={{ background: "linear-gradient(135deg,#E8C97A,#9A7A2E)", color: "#0A0A0F" }}>♎</span>
              </div>
              <div>
                <p className="font-display text-3xl">Anaïs Lune</p>
                <p className="text-sm text-[var(--text-secondary-color)] mt-1">anais.lune@cosmos.app</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[var(--text-secondary-color)]">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[var(--gold)]" /> 14 March 1996</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[var(--gold)]" /> 04:27 WET</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--gold)]" /> Lisbon, PT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-[var(--gold)]/15">
              {[
                { label: "Sun",        glyph: "☉", sign: "Pisces ♓",     deg: "23°48'" },
                { label: "Moon",       glyph: "☽", sign: "Virgo ♍",      deg: "11°02'" },
                { label: "Ascendant",  glyph: "AC", sign: "Aquarius ♒",   deg: "07°14'" },
              ].map((b) => (
                <div key={b.label} className="px-4 py-4 bg-white/[0.02] border border-[var(--gold)]/10">
                  <p className="label-caps">{b.label}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-3xl text-[var(--gold-light)]">{b.glyph}</span>
                    <span className="text-sm text-[var(--text-primary-color)]">{b.sign}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted-color)] mt-1 tabular-nums">{b.deg}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="label-caps">Celestial correspondence</p>
              <span className="text-[10px] text-[var(--text-muted-color)] tracking-widest">All times in WEST</span>
            </div>
            <div className="space-y-4">
              {[
                { key: "daily",   t: "Morning horoscope",        d: "Delivered at 07:00 each day, with the Sun's first light." },
                { key: "weekly",  t: "Sunday almanac",            d: "A longer reading for the week ahead, by your Moon sign." },
                { key: "transit", t: "Major transits & ingresses",d: "When a slow-moving planet enters a new sign or aspects your natal chart." },
              ].map((n) => (
                <div key={n.key} className="flex items-start justify-between gap-6 py-3 border-b border-[var(--gold)]/10 last:border-0">
                  <div>
                    <p className="text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontSize: "19px" }}>{n.t}</p>
                    <p className="text-xs text-[var(--text-secondary-color)] mt-1">{n.d}</p>
                  </div>
                  <Toggle on={(notif as any)[n.key]} onChange={(v) => setNotif({ ...notif, [n.key]: v })} />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              {[
                { k: "email", l: "Email" },
                { k: "push",  l: "Push" },
                { k: "sms",   l: "SMS · soon" },
              ].map((m, i) => (
                <button
                  key={m.k}
                  onClick={() => i < 2 && setNotif({ ...notif, [m.k]: !(notif as any)[m.k] })}
                  className={`px-4 py-2 text-xs tracking-widest uppercase border transition ${
                    (notif as any)[m.k]
                      ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5"
                      : "border-[var(--gold)]/15 text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]"
                  } ${i === 2 ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={i === 2}
                >
                  {m.l}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Saved charts */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="label-caps">Saved Charts · IV</p>
              <button className="flex items-center gap-1.5 text-xs label-caps text-[var(--gold-light)] hover:text-[var(--gold)]"><Plus size={12} /> New chart</button>
            </div>
            <div className="space-y-px">
              {[
                { id: "anais", name: "Anaïs Lune",     rel: "Self",     dt: "14 Mar 1996 · Lisbon",       glyph: "♓" },
                { id: "elias", name: "Élias B.",       rel: "Partner",  dt: "22 Jul 1993 · Marseille",     glyph: "♋" },
                { id: "mira",  name: "Mira (daughter)",rel: "Family",   dt: "03 Dec 2022 · Lisbon",        glyph: "♐" },
                { id: "studio",name: "Atelier Lune",   rel: "Venture",  dt: "11 Sep 2024 · 09:00 · Lisbon",glyph: "♍" },
              ].map((c) => {
                const active = chart === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setChart(c.id)}
                    className={`w-full grid grid-cols-[44px_1fr_120px_100px_40px] items-center gap-4 px-3 py-3 transition text-left ${
                      active ? "bg-[var(--gold)]/5 border-l-2 border-[var(--gold)]" : "hover:bg-white/[0.02] border-l-2 border-transparent"
                    }`}
                  >
                    <span className="font-display text-2xl text-[var(--gold-light)]">{c.glyph}</span>
                    <span className="text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontSize: "19px" }}>{c.name}</span>
                    <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted-color)]">{c.rel}</span>
                    <span className="text-xs text-[var(--text-secondary-color)]">{c.dt}</span>
                    <button className="text-[var(--text-muted-color)] hover:text-[var(--gold-light)] justify-self-end" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal size={16} />
                    </button>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Subscription */}
        <div className="space-y-6">
          <div className="relative p-8 overflow-hidden"
               style={{
                 background: "linear-gradient(150deg, #2D1B69 0%, #1E3A5F 60%, #0A0A0F 100%)",
                 border: "1px solid rgba(201,168,76,0.4)",
                 boxShadow: "0 24px 80px rgba(45,27,105,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
               }}>
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full opacity-50 blur-2xl" style={{ background: "radial-gradient(#C9A84C, transparent)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Crown size={14} className="text-[var(--gold)]" />
                <p className="label-caps text-[var(--gold-light)]">Current Plan</p>
              </div>
              <p className="font-display text-4xl gold-text mt-2">Celestial</p>
              <p className="text-sm text-[var(--text-secondary-color)] mt-2">Unlimited readings · synastry for IV charts · personal divinations.</p>

              <div className="flex items-baseline gap-1 mt-6">
                <span className="font-display text-5xl text-[var(--text-primary-color)]">€18</span>
                <span className="text-sm text-[var(--text-secondary-color)]">/ moon</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted-color)] tracking-widest mt-1">Renews 14 June MMXXVI</p>

              <ul className="mt-6 space-y-2.5 text-sm text-[var(--text-primary-color)]">
                {["Daily & weekly readings", "Natal, transit, synastry charts", "III divinations a day", "Priority interpreter access"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5"><Check size={13} className="text-[var(--gold)]" /> <span className="text-[var(--text-secondary-color)]">{f}</span></li>
                ))}
              </ul>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <GoldButton>Upgrade</GoldButton>
                <GoldButton variant="ghost">Manage</GoldButton>
              </div>
            </div>
          </div>

          <GlassCard className="p-6">
            <p className="label-caps mb-4">Practitioner</p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--purple-mid)] to-[var(--indigo-deep)] grid place-items-center text-[var(--gold-light)] font-display text-xl">M</div>
              <div>
                <p className="text-sm text-[var(--text-primary-color)]">Mãe Iolanda</p>
                <p className="text-[11px] text-[var(--text-secondary-color)] tracking-wider">Hellenistic · 24 yrs</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {[1,2,3,4,5].map((s) => <Star key={s} size={12} className="text-[var(--gold)] fill-[var(--gold)]" />)}
              <span className="text-xs text-[var(--text-secondary-color)] ml-2">5.0 · 412 readings</span>
            </div>
            <GoldButton variant="ghost" className="mt-5 w-full">Book a sitting</GoldButton>
          </GlassCard>

          <button className="w-full flex items-center justify-center gap-2 text-xs label-caps text-[var(--error)]/80 hover:text-[var(--error)] py-3">
            <Trash2 size={12} /> Close this account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   APP SHELL
   ───────────────────────────────────────────────────────────────────── */

export default function App() {
  const [page, setPage] = useState<PageKey>("landing");
  const [transitioning, setTransitioning] = useState(false);

  const go = (p: PageKey) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(p);
      setTransitioning(false);
      window.scrollTo({ top: 0 });
    }, 220);
  };

  if (page === "landing") {
    return (
      <div className="size-full min-h-screen" style={{ background: "#0A0A0F", color: "var(--text-primary-color)" }}>
        <div className={`transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}>
          <LandingPage setPage={go} />
        </div>
      </div>
    );
  }

  return (
    <div className="size-full min-h-screen flex relative" style={{ background: "#0A0A0F", color: "var(--text-primary-color)" }}>
      {/* persistent star field on app pages */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        <StarField density={80} />
      </div>

      <Sidebar page={page} setPage={go} />
      <main className={`flex-1 min-w-0 relative z-10 transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}>
        {page === "dashboard" && <Dashboard setPage={go} />}
        {page === "chart" && <BirthChartPage />}
        {page === "horoscope" && <HoroscopePage />}
        {page === "compatibility" && <CompatibilityPage />}
        {page === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}
