import { calculateNatalChart, signOf, type ChartData, type NatalInput, type Planet } from "@/lib/astrology";
import { calculateSynastry, type SynastryType } from "@/lib/astrology/synastry";

const TYPES: SynastryType[] = ["love", "friendship", "work", "family"];

const INNER: Planet[] = ["sun", "moon", "mercury", "venus", "mars"];

function summarize(c: ChartData) {
  const sun = c.planets.find((p) => p.planet === "sun")!;
  const moon = c.planets.find((p) => p.planet === "moon")!;
  return {
    sun: sun.sign,
    moon: moon.sign,
    asc: signOf(c.angles.asc),
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

  const type: SynastryType = TYPES.includes(body.type) ? body.type : "love";

  const chartA = await calculateNatalChart(a);
  const chartB = await calculateNatalChart(b);
  const result = calculateSynastry(chartA, chartB, type);

  return Response.json({ ...result, a: summarize(chartA), b: summarize(chartB) });
}
