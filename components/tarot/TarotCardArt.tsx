"use client";

import { useId } from "react";
import type { Suit, TarotCard } from "@/lib/tarot/deck";
import { ROMAN_MAJOR, RANK_THEMES } from "@/lib/tarot/deck";
import { useI18n } from "@/components/i18n/I18nProvider";
import { MajorScene } from "./majorArt";

/* Card canvas: 180 × 300 units, scaled by `width`. */
const W = 180;
const H = 300;
const CX = W / 2;

function SuitGlyph({ suit, x, y, s = 1, color = "#C9A84C" }: { suit: Suit; x: number; y: number; s?: number; color?: string }) {
  const t = `translate(${x - 12 * s} ${y - 12 * s}) scale(${s})`;
  if (suit === "wands") {
    return (
      <g transform={t} stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <line x1="7" y1="19" x2="17" y2="5" />
        <path d="M 15.2 4.4 Q 18 2.6 19.6 4.2 Q 18 6.2 15.9 5.6" fill={color} stroke="none" opacity="0.85" />
        <line x1="9.4" y1="13.5" x2="12.4" y2="15.5" />
        <line x1="12.2" y1="9.6" x2="15.2" y2="11.6" />
      </g>
    );
  }
  if (suit === "cups") {
    return (
      <g transform={t} stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M 5.5 5 H 18.5" />
        <path d="M 5.5 5 C 5.5 12 18.5 12 18.5 5" />
        <line x1="12" y1="11.2" x2="12" y2="16.5" />
        <path d="M 7.5 18.5 H 16.5" />
      </g>
    );
  }
  if (suit === "swords") {
    return (
      <g transform={t} stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <line x1="12" y1="3.2" x2="12" y2="16" />
        <path d="M 12 3.2 L 9.8 7 M 12 3.2 L 14.2 7" />
        <line x1="7.5" y1="14.2" x2="16.5" y2="14.2" />
        <circle cx="12" cy="19" r="1.6" fill={color} stroke="none" />
      </g>
    );
  }
  // pentacles
  const star: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (-90 + i * 144) * (Math.PI / 180);
    star.push(`${12 + Math.cos(a) * 6.2},${12 + Math.sin(a) * 6.2}`);
  }
  return (
    <g transform={t} stroke={color} strokeWidth="1.2" fill="none">
      <circle cx="12" cy="12" r="8.4" />
      <polygon points={star.join(" ")} strokeLinejoin="round" />
    </g>
  );
}

/* Classic pip layouts, positions in (col, row) around center. */
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[0, -1.4], [0, 1.4]],
  3: [[0, -1.5], [0, 0], [0, 1.5]],
  4: [[-1, -1.2], [1, -1.2], [-1, 1.2], [1, 1.2]],
  5: [[-1, -1.3], [1, -1.3], [0, 0], [-1, 1.3], [1, 1.3]],
  6: [[-1, -1.4], [1, -1.4], [-1, 0], [1, 0], [-1, 1.4], [1, 1.4]],
  7: [[-1, -1.5], [1, -1.5], [0, -0.75], [-1, 0], [1, 0], [-1, 1.5], [1, 1.5]],
  8: [[-1, -1.6], [1, -1.6], [0, -0.8], [-1, 0], [1, 0], [0, 0.8], [-1, 1.6], [1, 1.6]],
  9: [[-1, -1.7], [1, -1.7], [-1, -0.57], [1, -0.57], [0, 0], [-1, 0.57], [1, 0.57], [-1, 1.7], [1, 1.7]],
  10: [[-1, -1.8], [1, -1.8], [0, -1.2], [-1, -0.6], [1, -0.6], [-1, 0.6], [1, 0.6], [0, 1.2], [-1, 1.8], [1, 1.8]],
};

function Crown({ y, color = "#E8C97A" }: { y: number; color?: string }) {
  return (
    <path
      d={`M ${CX - 16} ${y} L ${CX - 16} ${y - 9} L ${CX - 8} ${y - 3} L ${CX} ${y - 12} L ${CX + 8} ${y - 3} L ${CX + 16} ${y - 9} L ${CX + 16} ${y} Z`}
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}

function CornerOrnaments() {
  const d = 12;
  return (
    <g stroke="#C9A84C" strokeWidth="0.8" opacity="0.6">
      <path d={`M 8 ${8 + d} V 8 H ${8 + d}`} fill="none" />
      <path d={`M ${W - 8 - d} 8 H ${W - 8} V ${8 + d}`} fill="none" />
      <path d={`M 8 ${H - 8 - d} V ${H - 8} H ${8 + d}`} fill="none" />
      <path d={`M ${W - 8 - d} ${H - 8} H ${W - 8} V ${H - 8 - d}`} fill="none" />
    </g>
  );
}

/** Ornate card back — rosette over deep violet. */
export function TarotCardBack({ width = 150 }: { width?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} className="h-auto select-none" aria-hidden>
      <defs>
        <radialGradient id={`tb-${uid}`} cx="0.5" cy="0.45" r="0.9">
          <stop offset="0%" stopColor="#2D1B69" />
          <stop offset="70%" stopColor="#191233" />
          <stop offset="100%" stopColor="#0A0A0F" />
        </radialGradient>
      </defs>
      <rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="10" fill={`url(#tb-${uid})`} stroke="#C9A84C" strokeWidth="1.4" />
      <rect x="7" y="7" width={W - 14} height={H - 14} rx="7" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.55" />
      <CornerOrnaments />
      {[52, 40, 28].map((r, i) => (
        <circle key={r} cx={CX} cy={H / 2} r={r} fill="none" stroke="#C9A84C" strokeWidth={i === 0 ? 0.7 : 0.45} opacity={0.5 - i * 0.08} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={CX + Math.cos(a) * 28} y1={H / 2 + Math.sin(a) * 28}
            x2={CX + Math.cos(a) * 52} y2={H / 2 + Math.sin(a) * 52}
            stroke="#C9A84C" strokeWidth="0.4" opacity="0.4"
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle key={`s-${i}`} cx={CX + Math.cos(a) * 66} cy={H / 2 + Math.sin(a) * 66} r="1.1" fill="#E8C97A" opacity="0.8" />
        );
      })}
      <text x={CX} y={H / 2 + 7} fontSize="22" fill="#E8C97A" textAnchor="middle" className="font-display">✦</text>
    </svg>
  );
}

interface TarotCardArtProps {
  card: TarotCard;
  reversed?: boolean;
  width?: number;
  dimmed?: boolean;
}

/** Front face of a card — typographic majors, classic pip minors, court crowns. */
export function TarotCardArt({ card, reversed = false, width = 150, dimmed = false }: TarotCardArtProps) {
  const uid = useId().replace(/:/g, "");
  const { locale } = useI18n();
  const name = card.name[locale];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      className="h-auto select-none"
      role="img"
      aria-label={name}
      opacity={dimmed ? 0.55 : 1}
    >
      <defs>
        <radialGradient id={`tf-${uid}`} cx="0.5" cy="0.35" r="1">
          <stop offset="0%" stopColor="#1a1a26" />
          <stop offset="100%" stopColor="#0C0C13" />
        </radialGradient>
        <filter id={`tg-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="10" fill={`url(#tf-${uid})`} stroke="#C9A84C" strokeWidth="1.3" />
      <rect x="7" y="7" width={W - 14} height={H - 14} rx="7" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />

      <g transform={reversed ? `rotate(180 ${CX} ${H / 2})` : undefined}>
        <CornerOrnaments />

        {card.arcana === "major" ? (
          <>
            <text x={CX} y="34" fontSize="15" fill="#E8C97A" textAnchor="middle" letterSpacing="2" className="font-display">
              {ROMAN_MAJOR(card.number)}
            </text>
            <line x1={CX - 22} y1="42" x2={CX + 22} y2="42" stroke="#C9A84C" strokeWidth="0.5" opacity="0.6" />
            <g transform="translate(40 56)" filter={`url(#tg-${uid})`}>
              <MajorScene n={card.number} />
            </g>
          </>
        ) : card.number <= 10 ? (
          <>
            <text x={CX} y="32" fontSize="13" fill="#E8C97A" textAnchor="middle" letterSpacing="2" className="font-display">
              {card.number === 1 ? "I" : ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][card.number]}
            </text>
            {PIPS[card.number].map(([cx, cy], i) => (
              <SuitGlyph
                key={i}
                suit={card.suit!}
                x={CX + cx * 34}
                y={H / 2 - 6 + cy * 40}
                s={card.number === 1 ? 2.4 : 1.05}
              />
            ))}
          </>
        ) : (
          <>
            <text x={CX} y="32" fontSize="11" fill="#E8C97A" textAnchor="middle" letterSpacing="2.5" className="font-display">
              {RANK_THEMES[card.number].label[locale].toUpperCase()}
            </text>
            {card.number >= 13 && <Crown y={H / 2 - 52} />}
            {card.number === 12 && (
              <path
                d={`M ${CX - 13} ${H / 2 - 52} L ${CX} ${H / 2 - 63} L ${CX + 13} ${H / 2 - 52}`}
                fill="none" stroke="#E8C97A" strokeWidth="1.2" strokeLinejoin="round"
              />
            )}
            <circle cx={CX} cy={H / 2 - 6} r="36" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
            <SuitGlyph suit={card.suit!} x={CX} y={H / 2 - 6} s={2.1} color="#E8C97A" />
          </>
        )}

        {/* name plate */}
        <line x1="20" y1={H - 44} x2={W - 20} y2={H - 44} stroke="#C9A84C" strokeWidth="0.5" opacity="0.6" />
        <text
          x={CX} y={H - 28}
          fontSize={name.length > 20 ? 10 : 11.5}
          fill="#F0EDE8"
          textAnchor="middle"
          letterSpacing="0.8"
          className="font-display"
        >
          {name.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
