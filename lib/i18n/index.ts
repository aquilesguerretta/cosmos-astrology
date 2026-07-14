import { cookies, headers } from "next/headers";
import { en, type Dict } from "./en";
import { pt } from "./pt";

export type Locale = "en" | "pt";
export const LOCALE_COOKIE = "cosmos-locale";

export const DICTS: Record<Locale, Dict> = { en, pt };

export function dictFor(locale: Locale): Dict {
  return DICTS[locale] ?? en;
}

/** Server-side locale: cookie first, then Accept-Language, default en. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  if (fromCookie === "pt" || fromCookie === "en") return fromCookie;
  const accept = (await headers()).get("accept-language") ?? "";
  return /\bpt\b|pt-/i.test(accept) ? "pt" : "en";
}

export async function getDict(): Promise<{ locale: Locale; dict: Dict }> {
  const locale = await getLocale();
  return { locale, dict: dictFor(locale) };
}

/** Intl locale tag for date formatting. */
export const intlTag = (locale: Locale) => (locale === "pt" ? "pt-BR" : "en-US");

export type { Dict };
