import Link from "next/link";
import { Calendar, Clock, MapPin, Crown, Check, Star, Plus, Trash2, Globe } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { calculateNatalChart, signOf, SIGN_MODALITY } from "@/lib/astrology";
import { getDict, intlTag } from "@/lib/i18n";
import { Card, ZodiacIcon, ZODIAC_BY_KEY, Button } from "@/components/ui";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { NotificationToggles } from "@/components/profile/NotificationToggles";
import { DownloadChartButton, type ChartReport } from "@/components/profile/DownloadChartButton";

export const metadata = { title: "The Self" };

const pad = (n: number) => String(n).padStart(2, "0");

export default async function ProfilePage() {
  const [{ locale, dict }, user] = await Promise.all([getDict(), getCurrentUser()]);
  const chart = await calculateNatalChart(user.birth);
  const sun = chart.planets.find((p) => p.planet === "sun")!;
  const moon = chart.planets.find((p) => p.planet === "moon")!;
  const ascSign = signOf(chart.angles.asc);
  const sunInfo = ZODIAC_BY_KEY[sun.sign];
  const displayName = user.name || dict.common.traveler;

  const [by, bm, bd] = user.birth.date.split("-").map(Number);
  const birthDateLabel = new Date(Date.UTC(by, bm - 1, bd)).toLocaleDateString(intlTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const report: ChartReport = {
    name: displayName,
    birth: `${birthDateLabel} · ${user.birth.time}`,
    location: user.birthLocation,
    sun: `${dict.zodiac.names[sun.sign]} ${sun.degree}°${pad(sun.minutes)}'`,
    moon: `${dict.zodiac.names[moon.sign]} ${moon.degree}°${pad(moon.minutes)}'`,
    ascendant: dict.zodiac.names[ascSign],
    planets: chart.planets.map((p) => ({
      name: dict.planets[p.planet],
      sign: dict.zodiac.names[p.sign],
      deg: `${p.degree}°${pad(p.minutes)}'`,
      house: p.house,
      retro: p.isRetrograde,
    })),
    aspects: chart.aspects.length,
  };

  const savedCharts = [
    {
      id: "self",
      name: displayName,
      rel: dict.profile.relSelf,
      dt: `${birthDateLabel} · ${user.birthLocation.split(",")[0] ?? ""}`,
      glyph: sunInfo.glyph,
    },
    { id: "elias", name: "Élias B.", rel: dict.profile.relPartner, dt: "22 Jul 1993 · Marseille", glyph: "♋" },
    { id: "mira", name: "Mira", rel: dict.profile.relFamily, dt: "03 Dec 2022 · Lisbon", glyph: "♐" },
    { id: "atelier", name: "Atelier Lune", rel: dict.profile.relVenture, dt: "11 Sep 2024 · Lisbon", glyph: "♍" },
  ];

  const sunTiles = [
    { label: dict.profile.sun, glyph: "☉", sign: `${dict.zodiac.names[sun.sign]} ${sunInfo.glyph}`, deg: `${sun.degree}°${pad(sun.minutes)}'` },
    { label: dict.profile.moon, glyph: "☽", sign: `${dict.zodiac.names[moon.sign]} ${ZODIAC_BY_KEY[moon.sign].glyph}`, deg: `${moon.degree}°${pad(moon.minutes)}'` },
    { label: dict.profile.ascendant, glyph: "AC", sign: `${dict.zodiac.names[ascSign]} ${ZODIAC_BY_KEY[ascSign].glyph}`, deg: "" },
  ];

  return (
    <div className="w-full max-w-[1280px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-10">
        <p className="label-caps text-[var(--gold)]/80">{dict.profile.label}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.profile.title}{" "}
          <em className="font-italic-display text-[var(--gold-light)]">{dict.profile.titleEm}</em>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Natal data */}
          <Card glow className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">{dict.profile.natalData}</p>
              <Link href="/onboarding" className="label-caps text-xs text-[var(--gold-light)] hover:text-[var(--gold)]">
                {dict.common.edit}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="relative">
                <div className="grid h-24 w-24 place-items-center rounded-full font-display text-5xl text-[var(--gold-light)]" style={{ background: "linear-gradient(135deg,#2D1B69,#1E3A5F)", border: "1px solid rgba(201,168,76,0.4)" }}>
                  {user.initial}
                </div>
                <span className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full text-lg text-[#0A0A0F]" style={{ background: "linear-gradient(135deg,#E8C97A,#9A7A2E)" }}>{sunInfo.glyph}</span>
              </div>
              <div className="min-w-0">
                <p className="font-display truncate text-3xl">{displayName}</p>
                {user.email && <p className="mt-1 truncate text-sm text-[var(--text-secondary-color)]">{user.email}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary-color)]">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[var(--gold)]" /> {birthDateLabel}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[var(--gold)]" /> {user.birth.time}</span>
                  {user.birthLocation && (
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--gold)]" /> {user.birthLocation}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[var(--gold)]/15 pt-6 sm:grid-cols-3">
              {sunTiles.map((b) => (
                <div key={b.label} className="border border-[var(--gold)]/10 bg-white/[0.02] px-4 py-4">
                  <p className="label-caps">{b.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-3xl text-[var(--gold-light)]">{b.glyph}</span>
                    <span className="text-sm text-[var(--text-primary-color)]">{b.sign}</span>
                  </div>
                  {b.deg && <p className="mt-1 text-xs tabular-nums text-[var(--text-muted-color)]">{b.deg}</p>}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <DownloadChartButton report={report} />
            </div>
          </Card>

          {/* Sun sign */}
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center">
                <div className="absolute inset-0 rounded-full border border-[var(--gold)]/30" />
                <ZodiacIcon sign={sun.sign} size={72} className="gold-text" />
              </div>
              <div>
                <p className="label-caps text-[var(--gold)]/80">{dict.profile.yourSun}</p>
                <p className="font-display text-3xl">{dict.zodiac.names[sun.sign]}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-secondary-color)]">
                  <span><span className="label-caps mr-1.5">{dict.reading.element}</span>{dict.elements[sunInfo.element.toLowerCase() as keyof typeof dict.elements]}</span>
                  <span><span className="label-caps mr-1.5">{dict.reading.modality}</span>{dict.modalities[SIGN_MODALITY[sun.sign]]}</span>
                  <span><span className="label-caps mr-1.5">{dict.reading.ruler}</span>{sunInfo.ruler}</span>
                </div>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "18px" }}>
              {dict.zodiac.blurbs[sun.sign]}
            </p>
          </Card>

          {/* Notifications */}
          <Card className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">{dict.profile.correspondence}</p>
              <span className="text-[10px] tracking-widest text-[var(--text-muted-color)]">{dict.profile.localTime}</span>
            </div>
            <NotificationToggles />
          </Card>

          {/* Saved charts */}
          <Card className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">{dict.profile.savedCharts} · {savedCharts.length}</p>
              <Link href="/onboarding" className="label-caps flex items-center gap-1.5 text-xs text-[var(--gold-light)] hover:text-[var(--gold)]">
                <Plus size={12} /> {dict.profile.newChart}
              </Link>
            </div>
            <div className="space-y-px">
              {savedCharts.map((c) => (
                <div key={c.id} className="grid grid-cols-[40px_1fr_auto] items-center gap-4 px-3 py-3 transition hover:bg-white/[0.02] sm:grid-cols-[40px_1fr_90px_auto]">
                  <span className="font-display text-2xl text-[var(--gold-light)]">{c.glyph}</span>
                  <span className="truncate text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}>{c.name}</span>
                  <span className="hidden text-[11px] uppercase tracking-widest text-[var(--text-muted-color)] sm:block">{c.rel}</span>
                  <span className="hidden text-xs text-[var(--text-secondary-color)] md:block">{c.dt}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2.5">
              <Globe size={14} className="text-[var(--gold)]" />
              <p className="label-caps">{dict.common.language}</p>
            </div>
            <LanguageSwitcher />
          </Card>

          <div className="relative overflow-hidden border border-[var(--gold)]/40 bg-[linear-gradient(150deg,#2D1B69_0%,#1E3A5F_60%,#0A0A0F_100%)] p-8 shadow-[0_24px_80px_rgba(45,27,105,0.5)]">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-[var(--gold)]" />
              <p className="label-caps text-[var(--gold-light)]">{dict.profile.currentPlan}</p>
            </div>
            <p className="font-display gold-text mt-2 text-4xl">{dict.profile.planName}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary-color)]">{dict.profile.planSub}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-5xl text-[var(--text-primary-color)]">€18</span>
              <span className="text-sm text-[var(--text-secondary-color)]">{dict.profile.perMoon}</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[dict.profile.planF1, dict.profile.planF2, dict.profile.planF3, dict.profile.planF4].map((f) => (
                <li key={f} className="flex items-center gap-2.5"><Check size={13} className="text-[var(--gold)]" /> <span className="text-[var(--text-secondary-color)]">{f}</span></li>
              ))}
            </ul>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Button>{dict.profile.upgrade}</Button>
              <Button variant="ghost">{dict.profile.manage}</Button>
            </div>
          </div>

          <Card className="p-6">
            <p className="label-caps mb-4">{dict.profile.practitioner}</p>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[var(--purple-mid)] to-[var(--indigo-deep)] font-display text-xl text-[var(--gold-light)]">M</div>
              <div>
                <p className="text-sm text-[var(--text-primary-color)]">Mãe Iolanda</p>
                <p className="text-[11px] tracking-wider text-[var(--text-secondary-color)]">{dict.profile.practitionerLine}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />)}
              <span className="ml-2 text-xs text-[var(--text-secondary-color)]">5.0 · 412 {dict.profile.readings}</span>
            </div>
          </Card>

          <button className="label-caps flex w-full items-center justify-center gap-2 py-3 text-xs text-[var(--error)]/80 transition hover:text-[var(--error)]">
            <Trash2 size={12} /> {dict.profile.closeAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
