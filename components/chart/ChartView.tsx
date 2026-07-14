"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import type { ChartData, Planet } from "@/lib/astrology";
import { Card } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";
import { PlanetTable } from "./PlanetTable";
import { ElementsBar } from "./ElementsBar";

const BirthChartWheel = dynamic(() => import("./BirthChartWheel").then((m) => m.BirthChartWheel), {
  ssr: false,
  loading: () => (
    <div className="aspect-square w-full max-w-[560px] animate-pulse rounded-full border border-[var(--gold)]/10 bg-white/[0.02]" />
  ),
});
const AspectGrid = dynamic(() => import("./AspectGrid").then((m) => m.AspectGrid), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-white/[0.02]" />,
});

/** Interactive composition: wheel + elements bar (left) and table + grid (right),
 *  with a synchronized planet highlight across wheel and table. */
export function ChartView({ chartData }: { chartData: ChartData }) {
  const { dict } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Planet | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <Card className="grid place-items-center p-4 sm:p-6">
          <motion.div
            className="grid w-full place-items-center"
            initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: [0.21, 0.65, 0.35, 1] }}
          >
            <BirthChartWheel chartData={chartData} highlightedPlanet={active} onPlanetHover={setActive} />
          </motion.div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#4A90D9]" /> {dict.chart.legendSoft}</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#E85C4C]" /> {dict.chart.legendHard}</span>
            <span className="flex items-center gap-2"><span className="h-px w-6 bg-[#C9A84C]" /> {dict.chart.legendConj}</span>
          </div>
        </Card>
        <Card className="p-6">
          <p className="label-caps mb-5">{dict.chart.elementsModalities}</p>
          <ElementsBar elements={chartData.elements} modalities={chartData.modalities} />
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <p className="label-caps mb-4">{dict.chart.placements}</p>
          <PlanetTable chartData={chartData} highlightedPlanet={active} onPlanetHover={setActive} />
        </Card>
        <Card className="p-6">
          <p className="label-caps mb-4">{dict.chart.aspectMatrix}</p>
          <AspectGrid chartData={chartData} />
        </Card>
      </div>
    </div>
  );
}
