import { z } from "zod";

export const NATAL_COOKIE = "cosmos-natal";

export const NatalCookieSchema = z.object({
  name: z.string().max(80).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timeZone: z.string().max(64).optional(),
  location: z.string().max(140).optional(),
});

export type NatalCookie = z.infer<typeof NatalCookieSchema>;

export function parseNatalCookie(raw: string | undefined): NatalCookie | null {
  if (!raw) return null;
  try {
    const parsed = NatalCookieSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
