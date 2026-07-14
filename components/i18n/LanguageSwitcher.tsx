"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "./I18nProvider";
import { cn } from "@/lib/utils";

const LOCALES = ["en", "pt"] as const;

/** Compact EN · PT toggle. Persists via cookie + full server refresh. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: (typeof LOCALES)[number]) {
    if (next === locale) return;
    document.cookie = `cosmos-locale=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em]",
        pending && "opacity-50",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-[var(--gold)]/40">·</span>}
          <button
            onClick={() => setLocale(l)}
            className={cn(
              "px-1 py-0.5 transition",
              locale === l
                ? "text-[var(--gold)]"
                : "text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]",
            )}
            aria-pressed={locale === l}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
