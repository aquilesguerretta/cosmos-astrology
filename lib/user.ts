import type { NatalInput } from "@/lib/astrology";
import { AUTH_ENABLED, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface CosmosUser {
  name: string;
  email: string;
  initial: string;
  birth: NatalInput;
  birthLocation: string;
}

/** Demo user used when no authenticated session / database is available.
 *  Real birth data for Anaïs Lune (figma persona): 14 Mar 1996, 04:27 WET, Lisbon. */
export const DEMO_USER: CosmosUser = {
  name: "Anaïs Lune",
  email: "anais.lune@cosmos.app",
  initial: "A",
  birth: { date: "1996-03-14", time: "04:27", lat: 38.7223, lng: -9.1393, utcOffset: 0 },
  birthLocation: "Lisbon, Portugal",
};

/**
 * Resolves the active user. With auth enabled, reads the NextAuth session +
 * Prisma user; falls back to the demo user when auth is off or the user hasn't
 * completed onboarding, so every dashboard page stays navigable.
 */
export async function getCurrentUser(): Promise<CosmosUser> {
  if (!AUTH_ENABLED) return DEMO_USER;
  try {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) return DEMO_USER;
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u || !u.birthDate || u.birthLat == null || u.birthLng == null) return DEMO_USER;
    return {
      name: u.name ?? "Seeker",
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
    };
  } catch {
    return DEMO_USER;
  }
}
