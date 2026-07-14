"use client";

import { ZODIAC, ZodiacIcon, type ZodiacSign } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface ZodiacGridProps {
  selected: ZodiacSign;
  userSign?: ZodiacSign;
  onSelect: (sign: ZodiacSign) => void;
}

export function ZodiacGrid({ selected, userSign, onSelect }: ZodiacGridProps) {
  const { dict } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {ZODIAC.map((z) => {
        const isSelected = z.key === selected;
        const isUser = z.key === userSign;
        return (
          <button
            key={z.key}
            onClick={() => onSelect(z.key)}
            className={cn(
              "group relative p-4 text-left transition-all duration-300",
              isSelected
                ? "bg-gradient-to-br from-[var(--purple-deep)]/40 to-transparent"
                : "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(74,45,158,0.25)]",
            )}
            style={{
              border: isSelected
                ? "1px solid rgba(201,168,76,0.5)"
                : isUser
                  ? "1px solid rgba(201,168,76,0.35)"
                  : "1px solid rgba(201,168,76,0.12)",
              boxShadow: isSelected
                ? "0 0 24px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.04)"
                : undefined,
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <ZodiacIcon
                sign={z.key}
                size={30}
                className={isSelected ? "text-[var(--gold)]" : "text-[var(--gold-light)]/80 group-hover:text-[var(--gold)]"}
              />
              <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">
                {dict.elements[z.element.toLowerCase() as keyof typeof dict.elements]}
              </span>
            </div>
            <p className="font-display text-lg text-[var(--text-primary-color)]">
              {dict.zodiac.names[z.key]}
              {isUser && <span className="ml-1.5 text-[10px] text-[var(--gold)]">✦</span>}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted-color)]">{dict.zodiac.dates[z.key]}</p>
            <p
              className="mt-3 text-[12px] italic leading-snug text-[var(--text-secondary-color)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {dict.zodiac.previews[z.key]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
