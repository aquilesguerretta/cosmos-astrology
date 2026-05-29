import { calculateNatalChart } from "@/lib/astrology";
import { ChartView } from "@/components/chart";

// TEMP preview for Prompt 5 — fixed Rio chart. Prompt 6 wires the logged-in
// user's natal data (+ redirect to /onboarding when absent) and the AI panel.
export default async function ChartPage() {
  const chartData = await calculateNatalChart({
    date: "2004-09-21",
    time: "08:30",
    lat: -22.9,
    lng: -43.17,
  });

  return (
    <div className="w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="mb-8">
        <p className="label-caps text-[var(--gold)]/80">Natal Inscription</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          The Chart of <em className="font-italic-display text-[var(--gold-light)]">Anaïs Lune</em>
        </h1>
        <p className="mt-2 text-sm tracking-wide text-[var(--text-secondary-color)]">
          21 September 2004 · 08:30 · Rio de Janeiro — preview
        </p>
      </div>
      <ChartView chartData={chartData} />
    </div>
  );
}
