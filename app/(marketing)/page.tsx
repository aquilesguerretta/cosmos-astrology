import Link from "next/link";
import { Check, Sparkles, Compass, BookOpen, Users, Layers, GraduationCap, PenLine, Orbit, ArrowRight } from "lucide-react";
import { Navbar, StarField } from "@/components/layout";
import { Card, ZodiacIcon, ZODIAC } from "@/components/ui";
import { Reveal, Enter } from "@/components/motion/Reveal";
import { getDict } from "@/lib/i18n";
import { NatalForm } from "./_components/NatalForm";
import { ZodiacWheelMark } from "./_components/ZodiacWheelMark";

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <span className="text-xs text-[var(--gold)]/60">✦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
    </div>
  );
}

export default async function LandingPage() {
  const { dict } = await getDict();
  const t = dict.landing;

  const FEATURES = [
    { icon: Compass, title: t.feature1t, body: t.feature1b },
    { icon: BookOpen, title: t.feature2t, body: t.feature2b },
    { icon: Sparkles, title: t.feature3t, body: t.feature3b },
    { icon: Users, title: t.feature4t, body: t.feature4b },
    { icon: Layers, title: t.feature5t, body: t.feature5b },
    { icon: GraduationCap, title: t.feature6t, body: t.feature6b },
  ];

  const HOW = [
    { icon: PenLine, n: "I", title: t.how1t, body: t.how1b },
    { icon: Orbit, n: "II", title: t.how2t, body: t.how2b },
    { icon: Sparkles, n: "III", title: t.how3t, body: t.how3b },
  ];

  const FOOTER_COLS = [
    { title: t.colExplore, links: [dict.nav.natalChart, dict.nav.dailyReading, dict.nav.tarot, dict.nav.synastry] },
    { title: t.colAtelier, links: [dict.nav.library, dict.nav.learn, dict.nav.practitioners, t.linkJournal] },
    { title: t.colCosmos, links: [t.linkAbout, t.linkPrivacy, t.linkTerms, t.linkContact] },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* ─────────── HERO ─────────── */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 opacity-50 md:opacity-100">
          <StarField density={180} interactive />
        </div>

        <div className="relative z-10">
          <Navbar />

          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 pb-24 pt-8 md:px-12 lg:grid-cols-[1.05fr_1fr]">
            {/* Left */}
            <div>
              <Enter delay={0}>
                <div className="mb-8 flex items-center gap-3">
                  <span className="h-px w-12 bg-[var(--gold)]/60" />
                  <span className="label-caps text-[var(--gold-light)]">{t.volume}</span>
                </div>
              </Enter>

              <Enter delay={0.1}>
                <h1 className="font-display text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-[var(--text-primary-color)]">
                  {t.heroYour}{" "}
                  <em className="font-italic-display font-light text-[var(--gold-light)]">{t.heroCosmic}</em>
                  <br />
                  {t.heroBlueprint}
                  <br />
                  <span className="gold-text">{t.heroAwaits}</span>
                </h1>
              </Enter>

              <Enter delay={0.22}>
                <p className="mt-8 max-w-md text-[17px] leading-relaxed text-[var(--text-secondary-color)]">
                  {t.heroSub}
                </p>
              </Enter>

              <Enter delay={0.34}>
                <NatalForm />
              </Enter>

              <Enter delay={0.46}>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
                  <span className="flex items-center gap-2">
                    <Check size={12} className="text-[var(--gold)]" /> {t.trust1}
                  </span>
                  <span className="flex items-center gap-2">
                    <Check size={12} className="text-[var(--gold)]" /> {t.trust2}
                  </span>
                  <span className="flex items-center gap-2">
                    <Check size={12} className="text-[var(--gold)]" /> {t.trust3}
                  </span>
                </div>
              </Enter>
            </div>

            {/* Right — decorative wheel */}
            <Enter delay={0.3} className="animate-float-slow relative hidden lg:block">
              <ZodiacWheelMark />
            </Enter>
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12">
        <Divider className="mb-12" />
        <Reveal>
          <div className="mb-12 text-center">
            <p className="label-caps text-[var(--gold)]/80">{t.howLabel}</p>
            <h2 className="font-display mt-3 text-4xl text-[var(--text-primary-color)]">{t.howTitle}</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {HOW.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal key={h.n} delay={i * 0.12}>
                <Card className="h-full p-7">
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center border border-[var(--gold)]/30 text-[var(--gold)]">
                      <Icon size={16} strokeWidth={1.4} />
                    </div>
                    <span className="font-display text-3xl text-[var(--gold)]/50">{h.n}</span>
                  </div>
                  <h3 className="font-display mt-6 text-2xl text-[var(--text-primary-color)]">{h.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary-color)]">{h.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-6 py-16 md:px-12">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="label-caps text-[var(--gold)]/80">{t.featuresLabel}</p>
            <h2 className="font-display mt-3 text-4xl text-[var(--text-primary-color)]">{t.featuresTitle}</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.1}>
                <Card className="h-full p-6 transition-transform duration-500 hover:-translate-y-1">
                  <div className="mb-6 grid h-10 w-10 place-items-center border border-[var(--gold)]/30 text-[var(--gold)]">
                    <Icon size={16} strokeWidth={1.4} />
                  </div>
                  <h3 className="font-display text-2xl text-[var(--text-primary-color)]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary-color)]">{f.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─────────── ZODIAC STRIP ─────────── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-6 py-12 md:px-12">
        <Reveal>
          <p className="label-caps mb-6 text-center text-[var(--gold)]/80">{t.theTwelve}</p>
        </Reveal>
        <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-6 md:overflow-visible lg:grid-cols-12">
          {ZODIAC.map((z, i) => (
            <Reveal key={z.key} delay={Math.min(i * 0.05, 0.5)}>
              <div className="glass group flex min-w-[108px] flex-col items-center gap-2 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/35 md:min-w-0">
                <ZodiacIcon
                  sign={z.key}
                  size={30}
                  className="text-[var(--gold-light)]/80 transition group-hover:text-[var(--gold)]"
                />
                <span className="font-display text-base text-[var(--text-primary-color)]">
                  {dict.zodiac.names[z.key]}
                </span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
                  {dict.elements[z.element.toLowerCase() as keyof typeof dict.elements]}
                </span>
                <span className="text-[9px] text-[var(--text-muted-color)] opacity-0 transition group-hover:opacity-100">
                  {dict.zodiac.dates[z.key]}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="relative z-10 mx-auto max-w-[900px] px-6 py-20 md:px-12">
        <Reveal>
          <div className="relative overflow-hidden border border-[var(--gold)]/30 bg-[linear-gradient(135deg,#1E3A5F_0%,#2D1B69_55%,#0A0A0F_100%)] p-10 text-center shadow-[0_24px_80px_rgba(45,27,105,0.4)] md:p-14">
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <StarField density={50} parallax={false} />
            </div>
            <div className="relative">
              <h2 className="font-display text-4xl text-[var(--text-primary-color)] md:text-5xl">{t.ctaTitle}</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary-color)]">
                {t.ctaSub}
              </p>
              <Link
                href="/sanctum"
                className="btn-gold group relative mt-8 inline-flex items-center gap-2 overflow-hidden px-8 py-3.5 font-sans text-[0.8rem] uppercase tracking-[0.08em]"
              >
                <span className="btn-shimmer absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  {t.ctaBtn} <ArrowRight size={14} />
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="relative z-10 border-t border-[var(--gold)]/10">
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
                {t.footerTagline}
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
            <span>Cosmos · MMXXVI</span>
            <span>Ad astra</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
