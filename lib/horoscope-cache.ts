import type { HoroscopeContent } from "@/lib/ai";

/** In-memory horoscope cache with 24h TTL, keyed by sign+date+locale.
 *  Prompt 9's HoroscopeCache Prisma table replaces this once a DB exists. */
const cache = new Map<string, { content: HoroscopeContent; expires: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;

const keyOf = (sign: string, date: string, locale: string) => `${sign}|${date}|${locale}`;

export function getCached(sign: string, date: string, locale: string): HoroscopeContent | null {
  const entry = cache.get(keyOf(sign, date, locale));
  if (entry && entry.expires > Date.now()) return entry.content;
  return null;
}

export function setCached(sign: string, date: string, locale: string, content: HoroscopeContent): void {
  cache.set(keyOf(sign, date, locale), { content, expires: Date.now() + TTL_MS });
}
