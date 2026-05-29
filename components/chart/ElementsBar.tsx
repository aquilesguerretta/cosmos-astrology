import type { ElementBalance, ModalityBalance } from "@/lib/astrology";

const ELEMENTS = [
  { key: "fire", label: "Fire", color: "#E85C4C" },
  { key: "earth", label: "Earth", color: "#4CAF82" },
  { key: "air", label: "Air", color: "#E8C97A" },
  { key: "water", label: "Water", color: "#4A90D9" },
] as const;

const MODALITIES = [
  { key: "cardinal", label: "Cardinal", color: "#E8C97A" },
  { key: "fixed", label: "Fixed", color: "#C9A4E8" },
  { key: "mutable", label: "Mutable", color: "#7AC9E8" },
] as const;

function Bars<T extends string>({
  title,
  rows,
  data,
  total,
}: {
  title: string;
  rows: ReadonlyArray<{ key: T; label: string; color: string }>;
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
              <span className="uppercase tracking-wider text-[var(--text-secondary-color)]">{r.label}</span>
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
  const elTotal = ELEMENTS.reduce((s, e) => s + elements[e.key], 0) || 1;
  const modTotal = MODALITIES.reduce((s, m) => s + modalities[m.key], 0) || 1;
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
      <Bars title="Elements" rows={ELEMENTS} data={elements} total={elTotal} />
      <Bars title="Modalities" rows={MODALITIES} data={modalities} total={modTotal} />
    </div>
  );
}
