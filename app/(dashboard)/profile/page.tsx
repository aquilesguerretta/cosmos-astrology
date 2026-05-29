import Link from "next/link";
import { Calendar, Clock, MapPin, Crown, Check, Star, Plus, Trash2 } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { calculateNatalChart, signOf, SIGN_MODALITY, type ZodiacSign } from "@/lib/astrology";
import { Card, ZodiacIcon, ZODIAC_BY_KEY, PLANET_NAMES, Button } from "@/components/ui";
import { NotificationToggles } from "@/components/profile/NotificationToggles";
import { DownloadChartButton, type ChartReport } from "@/components/profile/DownloadChartButton";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pad = (n: number) => String(n).padStart(2, "0");

const SIGN_BLURB: Record<ZodiacSign, string> = {
  aries: "First fire — you begin where others hesitate, and the world bends to your nerve.",
  taurus: "Rooted and sensual, you build slowly and keep what is beautiful and true.",
  gemini: "Quicksilver mind, two voices — you collect the world in words and connections.",
  cancer: "Tidal heart — you remember everything, and your care is a kind of weather.",
  leo: "Sovereign warmth — you are most yourself when seen, and your generosity is real.",
  virgo: "Devotion to the small and exact — you refine the raw world into something useful.",
  libra: "An instinct for balance and beauty — you find the just measure between extremes.",
  scorpio: "Depth and intensity — you trust only what survives being looked at directly.",
  sagittarius: "Far horizons — you live by meaning, and the journey is already the answer.",
  capricorn: "Patient architect — you climb by craft and keep your promises to time.",
  aquarius: "Mind set apart — you think in systems and belong to the future you imagine.",
  pisces: "Dissolved boundaries — you feel the whole ocean, and make from it song and image.",
};

export const metadata = { title: "The Self" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const chart = await calculateNatalChart(user.birth);
  const sun = chart.planets.find((p) => p.planet === "sun")!;
  const moon = chart.planets.find((p) => p.planet === "moon")!;
  const ascSign = signOf(chart.angles.asc);
  const sunInfo = ZODIAC_BY_KEY[sun.sign];
  const [by, bm, bd] = user.birth.date.split("-").map(Number);
  const birthLabel = `${bd} ${MONTHS[bm - 1]} ${by} · ${user.birth.time}`;

  const report: ChartReport = {
    name: user.name,
    birth: birthLabel,
    location: user.birthLocation,
    sun: `${sunInfo.name} ${sun.degree}°${pad(sun.minutes)}'`,
    moon: `${ZODIAC_BY_KEY[moon.sign].name} ${moon.degree}°${pad(moon.minutes)}'`,
    ascendant: ZODIAC_BY_KEY[ascSign].name,
    planets: chart.planets.map((p) => ({
      name: PLANET_NAMES[p.planet],
      sign: ZODIAC_BY_KEY[p.sign].name,
      deg: `${p.degree}°${pad(p.minutes)}'`,
      house: p.house,
      retro: p.isRetrograde,
    })),
    aspects: chart.aspects.length,
  };

  const savedCharts = [
    { id: "self", name: user.name, rel: "Self", dt: `${bd} ${MONTHS[bm - 1].slice(0, 3)} ${by} · ${user.birthLocation.split(",")[0]}`, glyph: sunInfo.glyph },
    { id: "elias", name: "Élias B.", rel: "Partner", dt: "22 Jul 1993 · Marseille", glyph: "♋" },
    { id: "mira", name: "Mira", rel: "Family", dt: "03 Dec 2022 · Lisbon", glyph: "♐" },
    { id: "atelier", name: "Atelier Lune", rel: "Venture", dt: "11 Sep 2024 · Lisbon", glyph: "♍" },
  ];

  const sunTiles = [
    { label: "Sun", glyph: "☉", sign: `${sunInfo.name} ${sunInfo.glyph}`, deg: `${sun.degree}°${pad(sun.minutes)}'` },
    { label: "Moon", glyph: "☽", sign: `${ZODIAC_BY_KEY[moon.sign].name} ${ZODIAC_BY_KEY[moon.sign].glyph}`, deg: `${moon.degree}°${pad(moon.minutes)}'` },
    { label: "Ascendant", glyph: "AC", sign: `${ZODIAC_BY_KEY[ascSign].name} ${ZODIAC_BY_KEY[ascSign].glyph}`, deg: "" },
  ];

  return (
    <div className="w-full max-w-[1280px] px-6 py-10 md:px-10">
      <header className="mb-10">
        <p className="label-caps text-[var(--gold)]/80">The Self in the Glass</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          Your <em className="font-italic-display text-[var(--gold-light)]">inscription</em>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Natal data */}
          <Card glow className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">Natal data</p>
              <Link href="/onboarding" className="label-caps text-xs text-[var(--gold-light)] hover:text-[var(--gold)]">Edit</Link>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="relative">
                <div className="grid h-24 w-24 place-items-center rounded-full font-display text-5xl text-[var(--gold-light)]" style={{ background: "linear-gradient(135deg,#2D1B69,#1E3A5F)", border: "1px solid rgba(201,168,76,0.4)" }}>
                  {user.initial}
                </div>
                <span className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full text-lg text-[#0A0A0F]" style={{ background: "linear-gradient(135deg,#E8C97A,#9A7A2E)" }}>{sunInfo.glyph}</span>
              </div>
              <div>
                <p className="font-display text-3xl">{user.name}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary-color)]">{user.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary-color)]">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[var(--gold)]" /> {bd} {MONTHS[bm - 1]} {by}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-[var(--gold)]" /> {user.birth.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--gold)]" /> {user.birthLocation}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[var(--gold)]/15 pt-6">
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
          <Card className="p-8">
            <div className="flex items-center gap-6">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center">
                <div className="absolute inset-0 rounded-full border border-[var(--gold)]/30" />
                <ZodiacIcon sign={sun.sign} size={72} className="gold-text" />
              </div>
              <div>
                <p className="label-caps text-[var(--gold)]/80">Your Sun</p>
                <p className="font-display text-3xl">{sunInfo.name}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-secondary-color)]">
                  <span><span className="label-caps mr-1.5">Element</span>{sunInfo.element}</span>
                  <span><span className="label-caps mr-1.5">Modality</span>{cap(SIGN_MODALITY[sun.sign])}</span>
                  <span><span className="label-caps mr-1.5">Ruler</span>{sunInfo.ruler}</span>
                </div>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-[var(--text-secondary-color)]" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "18px" }}>
              {SIGN_BLURB[sun.sign]}
            </p>
          </Card>

          {/* Notifications */}
          <Card className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">Celestial correspondence</p>
              <span className="text-[10px] tracking-widest text-[var(--text-muted-color)]">Local time</span>
            </div>
            <NotificationToggles />
          </Card>

          {/* Saved charts */}
          <Card className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="label-caps">Saved Charts · {savedCharts.length}</p>
              <Link href="/onboarding" className="label-caps flex items-center gap-1.5 text-xs text-[var(--gold-light)] hover:text-[var(--gold)]"><Plus size={12} /> New chart</Link>
            </div>
            <div className="space-y-px">
              {savedCharts.map((c) => (
                <div key={c.id} className="grid grid-cols-[40px_1fr_90px_auto] items-center gap-4 px-3 py-3 transition hover:bg-white/[0.02]">
                  <span className="font-display text-2xl text-[var(--gold-light)]">{c.glyph}</span>
                  <span className="text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}>{c.name}</span>
                  <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted-color)]">{c.rel}</span>
                  <span className="hidden text-xs text-[var(--text-secondary-color)] sm:block">{c.dt}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="relative overflow-hidden border border-[var(--gold)]/40 bg-[linear-gradient(150deg,#2D1B69_0%,#1E3A5F_60%,#0A0A0F_100%)] p-8 shadow-[0_24px_80px_rgba(45,27,105,0.5)]">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-[var(--gold)]" />
              <p className="label-caps text-[var(--gold-light)]">Current Plan</p>
            </div>
            <p className="font-display gold-text mt-2 text-4xl">Celestial</p>
            <p className="mt-2 text-sm text-[var(--text-secondary-color)]">Unlimited readings · synastry · personal divinations.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-5xl text-[var(--text-primary-color)]">€18</span>
              <span className="text-sm text-[var(--text-secondary-color)]">/ moon</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {["Daily & weekly readings", "Natal, transit & synastry", "III divinations a day", "Priority interpreter access"].map((f) => (
                <li key={f} className="flex items-center gap-2.5"><Check size={13} className="text-[var(--gold)]" /> <span className="text-[var(--text-secondary-color)]">{f}</span></li>
              ))}
            </ul>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Button>Upgrade</Button>
              <Button variant="ghost">Manage</Button>
            </div>
          </div>

          <Card className="p-6">
            <p className="label-caps mb-4">Practitioner</p>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[var(--purple-mid)] to-[var(--indigo-deep)] font-display text-xl text-[var(--gold-light)]">M</div>
              <div>
                <p className="text-sm text-[var(--text-primary-color)]">Mãe Iolanda</p>
                <p className="text-[11px] tracking-wider text-[var(--text-secondary-color)]">Hellenistic · 24 yrs</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />)}
              <span className="ml-2 text-xs text-[var(--text-secondary-color)]">5.0 · 412 readings</span>
            </div>
          </Card>

          <button className="label-caps flex w-full items-center justify-center gap-2 py-3 text-xs text-[var(--error)]/80 transition hover:text-[var(--error)]">
            <Trash2 size={12} /> Close this account
          </button>
        </div>
      </div>
    </div>
  );
}
