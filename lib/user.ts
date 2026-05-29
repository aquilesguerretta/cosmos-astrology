import type { NatalInput } from "@/lib/astrology";

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
 * Resolves the active user. Prompt 9 wires this to the NextAuth session +
 * Prisma; until a DB/session exists it returns the demo user so every
 * authenticated page stays navigable.
 */
export async function getCurrentUser(): Promise<CosmosUser> {
  return DEMO_USER;
}
