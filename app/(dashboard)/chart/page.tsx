import { calculateNatalChart, signOf } from "@/lib/astrology";
import { getCurrentUser } from "@/lib/user";
import { PLANET_NAMES, ZODIAC_BY_KEY } from "@/components/ui";
import { ChartView, InterpretationPanel, AskTheStars } from "@/components/chart";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatBirth(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y} · ${time}`;
}

export const metadata = { title: "Natal Chart" };

export default async function ChartPage() {
  const user = await getCurrentUser();
  const chart = await calculateNatalChart(user.birth);

  const sun = chart.planets.find((p) => p.planet === "sun")!;
  const moon = chart.planets.find((p) => p.planet === "moon")!;
  const ascSign = ZODIAC_BY_KEY[signOf(chart.angles.asc)];

  const summary =
    `${user.name} — Sun ${ZODIAC_BY_KEY[sun.sign].name} (House ${sun.house}), ` +
    `Moon ${ZODIAC_BY_KEY[moon.sign].name} (House ${moon.house}), Ascendant ${ascSign.name}. ` +
    chart.planets
      .map((p) => `${PLANET_NAMES[p.planet]} ${ZODIAC_BY_KEY[p.sign].name} H${p.house}`)
      .join(", ");

  return (
    <div className="w-full max-w-[1400px] px-6 py-10 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">Natal Inscription</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          The Chart of <em className="font-italic-display text-[var(--gold-light)]">{user.name}</em>
        </h1>
        <p className="mt-2 text-sm tracking-wide text-[var(--text-secondary-color)]">
          {formatBirth(user.birth.date, user.birth.time)} · {user.birthLocation}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--text-secondary-color)]">
          <span>☉ {ZODIAC_BY_KEY[sun.sign].name} {sun.degree}°{String(sun.minutes).padStart(2, "0")}&apos;</span>
          <span>☽ {ZODIAC_BY_KEY[moon.sign].name} {moon.degree}°{String(moon.minutes).padStart(2, "0")}&apos;</span>
          <span>↑ {ascSign.name}</span>
        </p>
      </header>

      <ChartView chartData={chart} />
      <InterpretationPanel chartData={chart} />
      <AskTheStars context={summary} />
    </div>
  );
}
