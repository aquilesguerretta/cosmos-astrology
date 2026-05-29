import type { HoroscopeContent } from "@/lib/ai";

/** In-memory horoscope cache with 24h TTL. Prompt 9 swaps this for the
 *  HoroscopeCache Prisma table once a database is provisioned; in-memory is a
 *  graceful (per-instance) fallback that works in local dev. */
const cache = new Map<string, { content: HoroscopeContent; expires: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;

const keyOf = (sign: string, date: string) => `${sign}|${date}`;

export function getCached(sign: string, date: string): HoroscopeContent | null {
  const entry = cache.get(keyOf(sign, date));
  if (entry && entry.expires > Date.now()) return entry.content;
  return null;
}

export function setCached(sign: string, date: string, content: HoroscopeContent): void {
  cache.set(keyOf(sign, date), { content, expires: Date.now() + TTL_MS });
}
