import { getLocale } from "@/lib/i18n";
import { findCity, type City } from "@/lib/cities";

interface OpenMeteoResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

/** Worldwide city search — Open-Meteo geocoding (free, keyless, localized).
 *  Falls back to the static offline list if the API is unreachable. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return Response.json({ results: [] });

  const locale = await getLocale();

  try {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}` +
      `&count=8&language=${locale}&format=json`;
    const res = await fetch(url, { next: { revalidate: 86_400 } });
    if (!res.ok) throw new Error(`geocode ${res.status}`);
    const data = (await res.json()) as { results?: OpenMeteoResult[] };

    const results: City[] = (data.results ?? [])
      .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
      .map((r) => ({
        name: r.name,
        region: r.admin1,
        country: r.country ?? "",
        lat: r.latitude,
        lng: r.longitude,
        timeZone: r.timezone ?? "UTC",
      }));

    return Response.json({ results });
  } catch {
    return Response.json({ results: findCity(q), offline: true });
  }
}
