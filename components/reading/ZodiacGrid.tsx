"use client";

import { ZODIAC, ZodiacIcon, type ZodiacSign } from "@/components/ui";
import { cn } from "@/lib/utils";

const PREVIEWS: Record<ZodiacSign, string> = {
  aries: "A door that resisted yields. Lean once more.",
  taurus: "Return to what you already know is true.",
  gemini: "Two messages, one of them worth keeping.",
  cancer: "The home you tend is tending you back.",
  leo: "Be photographed; let the light find you.",
  virgo: "Permit a small disorder; something will bloom.",
  libra: "An old equation rebalances of its own accord.",
  scorpio: "Speak the unspoken — quietly, but speak it.",
  sagittarius: "Buy the ticket; the journey already began.",
  capricorn: "The plinth is set. Place the stone.",
  aquarius: "A stranger's question is the one you needed.",
  pisces: "Trust the mood; it is older than the day.",
};

interface ZodiacGridProps {
  selected: ZodiacSign;
  userSign?: ZodiacSign;
  onSelect: (sign: ZodiacSign) => void;
}

export function ZodiacGrid({ selected, userSign, onSelect }: ZodiacGridProps) {
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
              <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted-color)]">{z.element}</span>
            </div>
            <p className="font-display text-lg text-[var(--text-primary-color)]">
              {z.name}
              {isUser && <span className="ml-1.5 text-[10px] text-[var(--gold)]">✦</span>}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--text-muted-color)]">{z.dates}</p>
            <p
              className="mt-3 text-[12px] italic leading-snug text-[var(--text-secondary-color)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {PREVIEWS[z.key]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
