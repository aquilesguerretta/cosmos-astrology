"use client";

import { createContext, useContext } from "react";
import type { Dict } from "@/lib/i18n/en";

type Locale = "en" | "pt";

const I18nContext = createContext<{ locale: Locale; dict: Dict } | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

/** Client hook — locale + full dictionary. Throws outside the provider. */
export function useI18n(): { locale: Locale; dict: Dict } {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
