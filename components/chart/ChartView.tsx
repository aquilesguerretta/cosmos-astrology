"use client";

import { useState } from "react";
import type { ChartData, Planet } from "@/lib/astrology";
import { Card } from "@/components/ui";
import { BirthChartWheel } from "./BirthChartWheel";
import { PlanetTable } from "./PlanetTable";
import { AspectGrid } from "./AspectGrid";
import { ElementsBar } from "./ElementsBar";

/** Interactive composition: wheel + elements bar (left) and table + grid (right),
 *  with a synchronized planet highlight across wheel and table. */
export function ChartView({ chartData }: { chartData: ChartData }) {
  const [active, setActive] = useState<Planet | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <Card className="grid place-items-center p-6">
          <BirthChartWheel chartData={chartData} highlightedPlanet={active} onPlanetHover={setActive} />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#4A90D9]" /> Trine / Sextile</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#E85C4C]" /> Square / Opp.</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#C9A84C]" /> Conjunction</span>
          </div>
        </Card>
        <Card className="p-6">
          <p className="label-caps mb-5">Elements & Modalities</p>
          <ElementsBar elements={chartData.elements} modalities={chartData.modalities} />
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <p className="label-caps mb-4">Placements · Placidus · Tropical</p>
          <PlanetTable chartData={chartData} highlightedPlanet={active} onPlanetHover={setActive} />
        </Card>
        <Card className="p-6">
          <p className="label-caps mb-4">Aspect Matrix</p>
          <AspectGrid chartData={chartData} />
        </Card>
      </div>
    </div>
  );
}
