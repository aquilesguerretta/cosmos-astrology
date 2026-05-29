import { calculateNatalChart, type ChartData, type NatalInput, type Planet } from "@/lib/astrology";
import { calculateSynastry } from "@/lib/astrology/synastry";

const INNER: Planet[] = ["sun", "moon", "mercury", "venus", "mars"];

function summarize(c: ChartData) {
  const sun = c.planets.find((p) => p.planet === "sun")!;
  return {
    sun: sun.sign,
    inner: INNER.map((k) => {
      const p = c.planets.find((x) => x.planet === k)!;
      return { planet: k, sign: p.sign };
    }),
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const a = body.personA?.birth as NatalInput | undefined;
  const b = body.personB?.birth as NatalInput | undefined;
  if (!a || !b) {
    return Response.json({ error: "two birth inputs required" }, { status: 400 });
  }

  const chartA = await calculateNatalChart(a);
  const chartB = await calculateNatalChart(b);
  const result = calculateSynastry(chartA, chartB);

  return Response.json({ ...result, a: summarize(chartA), b: summarize(chartB) });
}
