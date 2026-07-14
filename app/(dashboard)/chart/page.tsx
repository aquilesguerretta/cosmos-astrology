import { calculateNatalChart, signOf } from "@/lib/astrology";
import { getCurrentUser } from "@/lib/user";
import { getDict, intlTag } from "@/lib/i18n";
import { ZODIAC_BY_KEY } from "@/components/ui";
import { ChartView, InterpretationPanel, AskTheStars } from "@/components/chart";

export const metadata = { title: "Natal Chart" };

export default async function ChartPage() {
  const [{ locale, dict }, user] = await Promise.all([getDict(), getCurrentUser()]);
  const chart = await calculateNatalChart(user.birth);

  const sun = chart.planets.find((p) => p.planet === "sun")!;
  const moon = chart.planets.find((p) => p.planet === "moon")!;
  const ascSign = signOf(chart.angles.asc);
  const displayName = user.name || dict.common.traveler;

  const [y, m, d] = user.birth.date.split("-").map(Number);
  const birthLabel = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(intlTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const summary =
    `${displayName} — ${dict.planets.sun} ${dict.zodiac.names[sun.sign]} (${dict.common.house} ${sun.house}), ` +
    `${dict.planets.moon} ${dict.zodiac.names[moon.sign]} (${dict.common.house} ${moon.house}), ` +
    `${dict.profile.ascendant} ${dict.zodiac.names[ascSign]}. ` +
    chart.planets
      .map((p) => `${dict.planets[p.planet]} ${dict.zodiac.names[p.sign]} H${p.house}`)
      .join(", ");

  return (
    <div className="w-full max-w-[1400px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">{dict.chart.natalInscription}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.chart.chartOf} <em className="font-italic-display text-[var(--gold-light)]">{displayName}</em>
        </h1>
        <p className="mt-2 text-sm tracking-wide text-[var(--text-secondary-color)]">
          {birthLabel} · {user.birth.time}
          {user.birthLocation ? ` · ${user.birthLocation}` : ""}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--text-secondary-color)]">
          <span>☉ {dict.zodiac.names[sun.sign]} {sun.degree}°{String(sun.minutes).padStart(2, "0")}&apos;</span>
          <span>☽ {dict.zodiac.names[moon.sign]} {moon.degree}°{String(moon.minutes).padStart(2, "0")}&apos;</span>
          <span>↑ {dict.zodiac.names[ascSign]} {ZODIAC_BY_KEY[ascSign].glyph}</span>
        </p>
      </header>

      <ChartView chartData={chart} />
      <InterpretationPanel chartData={chart} />
      <AskTheStars context={summary} />
    </div>
  );
}
