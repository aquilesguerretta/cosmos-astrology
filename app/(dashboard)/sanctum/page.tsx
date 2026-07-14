import Link from "next/link";
import { Compass, BookOpen, Layers, Users, Library, GraduationCap, Search, Bell, ArrowRight, AlertTriangle } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { calculateNatalChart } from "@/lib/astrology";
import { moonPhase, activeTransits } from "@/lib/transits";
import { getDict, intlTag } from "@/lib/i18n";
import { Card, SignGlyph, PlanetSymbol } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { AskTheStars } from "@/components/chart";
import { buildChartSummary, buildDailyContext } from "@/lib/ai/context";
import { Greeting, MoonPhase, MoonPhaseDescription, PlanetStrip, ActiveTransits } from "@/components/dashboard";

export const metadata = { title: "Sanctum" };

export default async function SanctumPage() {
  const [{ locale, dict }, user] = await Promise.all([getDict(), getCurrentUser()]);
  const t = dict.sanctum;
  const natal = await calculateNatalChart(user.birth);

  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const transit = await calculateNatalChart({ date: todayISO, time: "12:00", lat: 0, lng: 0, utcOffset: 0 });

  const tSun = transit.planets.find((p) => p.planet === "sun")!;
  const tMoon = transit.planets.find((p) => p.planet === "moon")!;
  const tMerc = transit.planets.find((p) => p.planet === "mercury")!;
  const phase = moonPhase(tSun.longitude, tMoon.longitude);
  const transits = activeTransits(natal, transit);

  const dateLabel = now.toLocaleDateString(intlTag(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const moonName = dict.moon[phase.phaseKey];
  const overview =
    `${t.overviewMoon} ${dict.zodiac.names[tMoon.sign]} (${moonName}) ${t.overviewSun} ` +
    `${dict.zodiac.names[tSun.sign]}. ${t.overviewMercury} ${tMerc.isRetrograde ? dict.common.retrograde : dict.common.direct} ` +
    `${t.overviewIn} ${dict.zodiac.names[tMerc.sign]} — ${tMerc.isRetrograde ? t.adviceRx : t.adviceDirect}`;

  const natalSun = natal.planets.find((p) => p.planet === "sun")!;

  // Full-chart grounding for "ask about your day": every natal placement +
  // today's sky measured against it.
  const dailyContext =
    buildChartSummary(natal, dict, user.name || dict.common.traveler) +
    "\n" +
    buildDailyContext(natal, transit, dict, dateLabel);

  const ACTIONS = [
    { title: t.actionChartT, caption: t.actionChartC, href: "/chart", icon: Compass, accent: <PlanetSymbol planet="sun" size={20} strokeWidth={1.6} /> },
    { title: t.actionReadingT, caption: t.actionReadingC, href: "/reading", icon: BookOpen, accent: <SignGlyph sign={natalSun.sign} size={20} strokeWidth={1.6} /> },
    { title: dict.nav.tarot, caption: t.actionTarotC, href: "/tarot", icon: Layers, accent: <span className="font-display text-xl leading-none">✦</span> },
    { title: t.actionSynastryT, caption: t.actionSynastryC, href: "/synastry", icon: Users, accent: <PlanetSymbol planet="venus" size={20} strokeWidth={1.6} /> },
    { title: dict.nav.library, caption: t.actionLibraryC, href: "/library", icon: Library, accent: <PlanetSymbol planet="moon" size={20} strokeWidth={1.6} /> },
    { title: dict.nav.learn, caption: t.actionLearnC, href: "/learn", icon: GraduationCap, accent: <PlanetSymbol planet="saturn" size={20} strokeWidth={1.6} /> },
  ];

  return (
    <div className="w-full max-w-[1280px] px-6 py-10 md:px-10">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="label-caps text-[var(--gold)]/80">{dateLabel}</p>
          <div className="mt-2">
            <Greeting name={user.name} />
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button className="glass grid h-10 w-10 place-items-center text-[var(--text-secondary-color)] transition hover:border-[var(--gold)]/40"><Search size={15} strokeWidth={1.5} /></button>
          <button className="glass relative grid h-10 w-10 place-items-center text-[var(--text-secondary-color)] transition hover:border-[var(--gold)]/40">
            <Bell size={15} strokeWidth={1.5} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
          </button>
        </div>
      </div>

      {/* Hero overview */}
      <div className="relative mb-10 overflow-hidden border border-[var(--gold)]/25 bg-[linear-gradient(135deg,#1E3A5F_0%,#2D1B69_50%,#0A0A0F_100%)] p-8 shadow-[0_24px_80px_rgba(45,27,105,0.4)] md:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="label-caps text-[var(--gold-light)]">{t.overviewLabel}</p>
              {tMerc.isRetrograde && (
                <span className="inline-flex items-center gap-1 border border-[var(--warning)]/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--warning)]">
                  <AlertTriangle size={10} /> {t.mercuryRx}
                </span>
              )}
            </div>
            <p className="mt-5 max-w-xl leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 300 }}>
              {overview}
            </p>
            <Link href="/reading" className="btn-gold group relative mt-7 inline-flex items-center gap-2 overflow-hidden px-7 py-3 font-sans text-[0.8rem] uppercase tracking-[0.08em]">
              <span className="btn-shimmer absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">{t.fullReading} <ArrowRight size={14} /></span>
            </Link>
          </div>
          <div className="flex items-center lg:justify-end">
            <MoonPhase info={phase} size={72} />
          </div>
        </div>
      </div>

      {/* Planetary positions */}
      <div className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h3 className="font-display text-2xl text-[var(--text-primary-color)]">{t.positionsTitle}</h3>
          <p className="label-caps hidden sm:block">{dateLabel}</p>
        </div>
        <PlanetStrip planets={transit.planets} />
      </div>

      {/* Action cards */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.title} delay={i * 0.07}>
            <Link href={c.href} className="block h-full">
              <Card className="group p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(201,168,76,0.18)]">
                <div className="mb-8 flex items-start justify-between">
                  <div className="grid h-9 w-9 place-items-center border border-[var(--gold)]/30 text-[var(--gold)] transition group-hover:border-[var(--gold)]">
                    <Icon size={15} strokeWidth={1.4} />
                  </div>
                  <span className="text-[var(--gold-light)]">{c.accent}</span>
                </div>
                <p className="font-display text-2xl text-[var(--text-primary-color)]">{c.title}</p>
                <p className="mt-2 text-xs tracking-wide text-[var(--text-secondary-color)]">{c.caption}</p>
                <div className="label-caps mt-6 flex items-center gap-2 text-[var(--gold-light)]">
                  {dict.common.enter} <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
            </Reveal>
          );
        })}
      </div>

      {/* Transits + moon */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-7">
          <p className="label-caps mb-5">{t.transitsLabel}</p>
          <ActiveTransits transits={transits} />
        </Card>
        <Card className="p-7">
          <p className="label-caps mb-5">{t.moonLabel}</p>
          <MoonPhase info={phase} size={72} />
          <MoonPhaseDescription info={phase} />
        </Card>
      </div>

      {/* Ask about your day — grounded in the FULL natal chart + today's sky */}
      <AskTheStars context={dailyContext} title={t.askDayTitle} placeholder={t.askDayPlaceholder} />
    </div>
  );
}
