import { cookies } from "next/headers";
import { NATAL_COOKIE, NatalCookieSchema } from "@/lib/natal-cookie";
import { isValidTimeZone } from "@/lib/timezone";

/** Persists the visitor's natal data in a cookie so the whole app renders
 *  THEIR chart without requiring an account. Auth users get DB persistence
 *  via /api/onboarding instead. */
export async function POST(req: Request) {
  const parsed = NatalCookieSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: "Invalid natal data." }, { status: 400 });
  }
  const data = parsed.data;
  if (data.timeZone && !isValidTimeZone(data.timeZone)) {
    delete data.timeZone; // engine falls back to longitude-based offset
  }

  const store = await cookies();
  store.set(NATAL_COOKIE, encodeURIComponent(JSON.stringify(data)), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(NATAL_COOKIE);
  return Response.json({ ok: true });
}
