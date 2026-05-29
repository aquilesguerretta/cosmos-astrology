import { Check, Sparkles, Compass, BookOpen, Users } from "lucide-react";
import { Navbar, StarField } from "@/components/layout";
import { Card, ZodiacIcon, ZODIAC } from "@/components/ui";
import { NatalForm } from "./_components/NatalForm";
import { ZodiacWheelMark } from "./_components/ZodiacWheelMark";

const FEATURES = [
  {
    icon: Compass,
    title: "Swiss-Precision Charts",
    body: "Natal, transit and synastry maps drawn to the arcminute — the same engine the masters trust.",
  },
  {
    icon: BookOpen,
    title: "Daily Celestial Readings",
    body: "Twelve voices, one sky. A reading each morning, cast for your sign and the day's transits.",
  },
  {
    icon: Sparkles,
    title: "AI Interpretations",
    body: "A constellation-trained intelligence reads the lines of your chart in plain, luminous language.",
  },
  {
    icon: Users,
    title: "Synastry & Resonance",
    body: "See how two charts speak when the planets are placed beside each other — love, work, kinship.",
  },
];

const FOOTER_COLS = [
  { title: "Explore", links: ["Natal Chart", "Daily Reading", "Synastry", "The Sanctum"] },
  { title: "Atelier", links: ["Practitioners", "Almanac", "Membership", "Journal"] },
  { title: "Cosmos", links: ["About", "Privacy", "Terms", "Contact"] },
];

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <span className="text-xs text-[var(--gold)]/60">✦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ─────────── HERO ─────────── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* star field — more subtle on mobile */}
        <div className="absolute inset-0 opacity-50 md:opacity-100">
          <StarField density={180} />
        </div>

        <div className="relative z-10">
          <Navbar />

          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 pb-24 pt-8 md:px-12 lg:grid-cols-[1.05fr_1fr]">
            {/* Left */}
            <div className="animate-fade-up">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-12 bg-[var(--gold)]/60" />
                <span className="label-caps text-[var(--gold-light)]">
                  Vol. XIV · Equinox Edition
                </span>
              </div>

              <h1 className="font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-[var(--text-primary-color)]">
                Your{" "}
                <em className="font-italic-display font-light text-[var(--gold-light)]">
                  cosmic
                </em>
                <br />
                blueprint
                <br />
                <span className="gold-text">awaits.</span>
              </h1>

              <p className="mt-8 max-w-md text-[17px] leading-relaxed text-[var(--text-secondary-color)]">
                Precision astrology drawn from two millennia of celestial observation —
                interpreted by master practitioners and a constellation-trained
                intelligence.
              </p>

              <NatalForm />

              {/* trust marks */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
                <span className="flex items-center gap-2">
                  <Check size={12} className="text-[var(--gold)]" /> Swiss Ephemeris
                </span>
                <span className="flex items-center gap-2">
                  <Check size={12} className="text-[var(--gold)]" /> Whole-sign & Placidus
                </span>
                <span className="flex items-center gap-2">
                  <Check size={12} className="text-[var(--gold)]" /> 1.6M readings
                </span>
              </div>
            </div>

            {/* Right — decorative wheel (hidden on small screens) */}
            <div className="animate-float-slow relative hidden lg:block">
              <ZodiacWheelMark />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12">
        <Divider className="mb-12" />
        <div className="mb-10 text-center">
          <p className="label-caps text-[var(--gold)]/80">What the Sanctum holds</p>
          <h2 className="font-display mt-3 text-4xl text-[var(--text-primary-color)]">
            An observatory for the self
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-6">
                <div className="mb-6 grid h-10 w-10 place-items-center border border-[var(--gold)]/30 text-[var(--gold)]">
                  <Icon size={16} strokeWidth={1.4} />
                </div>
                <h3 className="font-display text-2xl text-[var(--text-primary-color)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary-color)]">
                  {f.body}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─────────── ZODIAC STRIP ─────────── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-6 py-12 md:px-12">
        <p className="label-caps mb-6 text-center text-[var(--gold)]/80">The Twelve</p>
        <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-6 md:overflow-visible lg:grid-cols-12">
          {ZODIAC.map((z) => (
            <div
              key={z.key}
              className="glass group flex min-w-[108px] flex-col items-center gap-2 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 md:min-w-0"
            >
              <ZodiacIcon
                sign={z.key}
                size={32}
                className="text-[var(--gold-light)]/80 transition group-hover:text-[var(--gold)]"
              />
              <span className="font-display text-base text-[var(--text-primary-color)]">
                {z.name}
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
                {z.element}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative z-10 mt-12 border-t border-[var(--gold)]/10">
        <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 22 22" className="text-[var(--gold)]">
                  <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
                  <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                  <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                </svg>
                <span className="font-display gold-text text-xl">Cosmos</span>
              </div>
              <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-[var(--text-muted-color)]">
                Precision astrology for the modern seeker. Est · MMXXVI.
              </p>
            </div>

            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="label-caps mb-3">{col.title}</p>
                <ul className="space-y-2 text-sm text-[var(--text-secondary-color)]">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="transition hover:text-[var(--gold-light)]">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--gold)]/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted-color)] md:flex-row">
            <span>Lisbon · 38.7°N</span>
            <span>Mercury enters Virgo · IV days</span>
            <span>Waxing Gibbous · 87%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
