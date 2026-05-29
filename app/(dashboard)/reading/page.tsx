import { calculateNatalChart } from "@/lib/astrology";
import { getCurrentUser } from "@/lib/user";
import { ReadingClient } from "@/components/reading";

export default async function ReadingPage() {
  const user = await getCurrentUser();
  const chart = await calculateNatalChart(user.birth);
  const sun = chart.planets.find((p) => p.planet === "sun")!;

  return (
    <div className="w-full max-w-[1280px] px-6 py-10 md:px-10">
      <header className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">The Daily Reading</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          Twelve voices, <em className="font-italic-display text-[var(--gold-light)]">one sky</em>
        </h1>
      </header>
      <ReadingClient userSign={sun.sign} />
    </div>
  );
}
