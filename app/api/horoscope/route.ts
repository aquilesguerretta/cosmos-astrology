import { calculateNatalChart, SIGN_ORDER, type ZodiacSign } from "@/lib/astrology";
import {
  generateJSON,
  HOROSCOPE_SYSTEM,
  horoscopePrompt,
  horoscopeFallback,
  type HoroscopeContent,
} from "@/lib/ai";
import { ZODIAC_BY_KEY, PLANET_NAMES } from "@/components/ui";
import { getCached, setCached } from "@/lib/horoscope-cache";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sign = searchParams.get("sign") as ZodiacSign | null;
  const date = searchParams.get("date") ?? todayISO();

  if (!sign || !SIGN_ORDER.includes(sign)) {
    return Response.json({ error: "invalid sign" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "invalid date" }, { status: 400 });
  }
  // No further than 7 days into the future.
  const max = new Date();
  max.setUTCDate(max.getUTCDate() + 7);
  if (new Date(`${date}T00:00:00Z`).getTime() > max.getTime()) {
    return Response.json({ error: "date too far ahead" }, { status: 400 });
  }

  const cached = getCached(sign, date);
  if (cached) return Response.json(cached);

  // Transient (transit) positions for the day — geocentric at Greenwich noon.
  const transitChart = await calculateNatalChart({ date, time: "12:00", lat: 0, lng: 0, utcOffset: 0 });
  const transits = transitChart.planets
    .filter((p) => p.planet !== "northNode")
    .map((p) => `${PLANET_NAMES[p.planet]} em ${ZODIAC_BY_KEY[p.sign].name}${p.isRetrograde ? " (retrógrado)" : ""}`)
    .join(", ");

  const content = await generateJSON<HoroscopeContent>({
    system: HOROSCOPE_SYSTEM,
    prompt: horoscopePrompt(ZODIAC_BY_KEY[sign].name, date, transits),
    maxTokens: 700,
    fallback: horoscopeFallback(ZODIAC_BY_KEY[sign].name),
  });

  setCached(sign, date, content);
  return Response.json(content);
}
