import type { AspectType } from "@/lib/astrology";

/** Display metadata for aspects. Colors follow the Prompt 5 wheel scheme:
 *  soft (trine/sextile) = blue, hard (square/opposition) = red, conjunction = gold. */
export const ASPECT_META: Record<
  AspectType,
  { symbol: string; color: string; label: string }
> = {
  conjunction: { symbol: "☌", color: "#C9A84C", label: "Conjunction" },
  opposition: { symbol: "☍", color: "#E85C4C", label: "Opposition" },
  trine: { symbol: "△", color: "#4A90D9", label: "Trine" },
  square: { symbol: "□", color: "#E85C4C", label: "Square" },
  sextile: { symbol: "✶", color: "#4A90D9", label: "Sextile" },
  quincunx: { symbol: "⚻", color: "#9B97A8", label: "Quincunx" },
};
