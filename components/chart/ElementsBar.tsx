"use client";

import type { ElementBalance, ModalityBalance } from "@/lib/astrology";
import { useI18n } from "@/components/i18n/I18nProvider";

const ELEMENT_ROWS = [
  { key: "fire", color: "#E85C4C" },
  { key: "earth", color: "#4CAF82" },
  { key: "air", color: "#E8C97A" },
  { key: "water", color: "#4A90D9" },
] as const;

const MODALITY_ROWS = [
  { key: "cardinal", color: "#E8C97A" },
  { key: "fixed", color: "#C9A4E8" },
  { key: "mutable", color: "#7AC9E8" },
] as const;

function Bars<T extends string>({
  title,
  rows,
  labels,
  data,
  total,
}: {
  title: string;
  rows: ReadonlyArray<{ key: T; color: string }>;
  labels: Record<T, string>;
  data: Record<T, number>;
  total: number;
}) {
  return (
    <div>
      <p className="label-caps mb-3">{title}</p>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="uppercase tracking-wider text-[var(--text-secondary-color)]">{labels[r.key]}</span>
              <span className="text-[var(--gold-light)]">{data[r.key]}</span>
            </div>
            <div className="h-[3px] overflow-hidden bg-white/5">
              <div className="h-full" style={{ width: `${(data[r.key] / total) * 100}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ElementsBar({ elements, modalities }: { elements: ElementBalance; modalities: ModalityBalance }) {
  const { dict } = useI18n();
  const elTotal = ELEMENT_ROWS.reduce((s, e) => s + elements[e.key], 0) || 1;
  const modTotal = MODALITY_ROWS.reduce((s, m) => s + modalities[m.key], 0) || 1;
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
      <Bars title={dict.chart.elements} rows={ELEMENT_ROWS} labels={dict.elements} data={elements} total={elTotal} />
      <Bars title={dict.chart.modalities} rows={MODALITY_ROWS} labels={dict.modalities} data={modalities} total={modTotal} />
    </div>
  );
}
