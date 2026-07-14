"use client";

import type { TarotCard } from "@/lib/tarot/deck";
import { TarotCardArt, TarotCardBack } from "./TarotCardArt";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  card: TarotCard;
  reversed: boolean;
  revealed: boolean;
  width?: number;
  onReveal?: () => void;
}

/** 3D flip: ornate back → card face. */
export function FlipCard({ card, reversed, revealed, width = 132, onReveal }: FlipCardProps) {
  return (
    <button
      type="button"
      onClick={() => !revealed && onReveal?.()}
      className={cn("group relative block [perspective:1100px]", !revealed && "cursor-pointer")}
      style={{ width, aspectRatio: "180 / 300" }}
      aria-pressed={revealed}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]",
          revealed && "[transform:rotateY(180deg)]",
        )}
      >
        {/* back */}
        <div className="absolute inset-0 [backface-visibility:hidden] transition-transform duration-300 group-hover:[transform:translateY(-4px)]">
          <TarotCardBack width={width} />
        </div>
        {/* face */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <TarotCardArt card={card} reversed={reversed} width={width} />
        </div>
      </div>
    </button>
  );
}
