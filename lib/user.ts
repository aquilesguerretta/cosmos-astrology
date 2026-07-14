import { cookies } from "next/headers";
import type { NatalInput } from "@/lib/astrology";
import { AUTH_ENABLED, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NATAL_COOKIE, parseNatalCookie } from "@/lib/natal-cookie";

export interface CosmosUser {
  /** Empty string when the visitor gave no name — render dict.common.traveler. */
  name: string;
  email: string;
  initial: string;
  birth: NatalInput;
  birthLocation: string;
  /** Where the data came from: authenticated DB row, natal cookie, or demo. */
  source: "db" | "cookie" | "demo";
}

/** Demo persona (figma): Anaïs Lune — 14 Mar 1996, 04:27, Lisbon. */
export const DEMO_USER: CosmosUser = {
  name: "Anaïs Lune",
  email: "anais.lune@cosmos.app",
  initial: "A",
  birth: { date: "1996-03-14", time: "04:27", lat: 38.7223, lng: -9.1393, timeZone: "Europe/Lisbon" },
  birthLocation: "Lisbon, Portugal",
  source: "demo",
};

/**
 * Active user resolution, in order:
 * 1. Authenticated session + completed onboarding → database row.
 * 2. `cosmos-natal` cookie (set by the landing form / demo onboarding).
 * 3. Demo persona.
 */
export async function getCurrentUser(): Promise<CosmosUser> {
  if (AUTH_ENABLED) {
    try {
      const session = await auth();
      const id = session?.user?.id;
      if (id) {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u?.birthDate && u.birthLat != null && u.birthLng != null) {
          return {
            name: u.name ?? "",
            email: u.email,
            initial: (u.name ?? "S").trim()[0]?.toUpperCase() ?? "S",
            birth: {
              date: u.birthDate.toISOString().slice(0, 10),
              time: u.birthTime ?? "12:00",
              lat: u.birthLat,
              lng: u.birthLng,
              utcOffset: u.utcOffset ?? undefined,
            },
            birthLocation: u.birthLocation ?? "",
            source: "db",
          };
        }
      }
    } catch {
      /* fall through to cookie/demo */
    }
  }

  const store = await cookies();
  const natal = parseNatalCookie(store.get(NATAL_COOKIE)?.value);
  if (natal) {
    return {
      name: natal.name ?? "",
      email: "",
      initial: (natal.name ?? "✦").trim()[0]?.toUpperCase() ?? "✦",
      birth: {
        date: natal.date,
        time: natal.time,
        lat: natal.lat,
        lng: natal.lng,
        timeZone: natal.timeZone,
      },
      birthLocation: natal.location ?? "",
      source: "cookie",
    };
  }

  return DEMO_USER;
}
