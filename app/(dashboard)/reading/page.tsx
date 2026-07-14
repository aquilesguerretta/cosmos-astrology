import { calculateNatalChart } from "@/lib/astrology";
import { getCurrentUser } from "@/lib/user";
import { getDict } from "@/lib/i18n";
import { Explainer } from "@/components/ui";
import { ReadingClient } from "@/components/reading";

export const metadata = { title: "Daily Reading" };

export default async function ReadingPage() {
  const [{ dict }, user] = await Promise.all([getDict(), getCurrentUser()]);
  const chart = await calculateNatalChart(user.birth);
  const sun = chart.planets.find((p) => p.planet === "sun")!;

  return (
    <div className="w-full max-w-[1280px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">{dict.reading.label}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.reading.title1}{" "}
          <em className="font-italic-display text-[var(--gold-light)]">{dict.reading.title2}</em>
        </h1>
      </header>
      <Explainer title={dict.reading.explainerTitle} body={dict.reading.explainer} className="mb-8" />
      <ReadingClient userSign={sun.sign} />
    </div>
  );
}
