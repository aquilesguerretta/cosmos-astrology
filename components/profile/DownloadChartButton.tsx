"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui";
import { useI18n } from "@/components/i18n/I18nProvider";

export interface ChartReport {
  name: string;
  birth: string;
  location: string;
  sun: string;
  moon: string;
  ascendant: string;
  planets: { name: string; sign: string; deg: string; house: number; retro: boolean }[];
  aspects: number;
}

export function DownloadChartButton({ report }: { report: ChartReport }) {
  const { dict } = useI18n();
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      let y = 64;
      doc.setFont("times", "normal");
      doc.setFontSize(24);
      doc.text(`Cosmos — ${dict.nav.natalChart}`, 56, y);
      y += 30;
      doc.setFontSize(13);
      doc.text(report.name, 56, y);
      y += 16;
      doc.setTextColor(120);
      doc.setFontSize(10);
      doc.text(`${report.birth}  ·  ${report.location}`, 56, y);
      y += 26;
      doc.setTextColor(20);
      doc.setFontSize(12);
      doc.text(
        `${dict.profile.sun} ${report.sun}     ${dict.profile.moon} ${report.moon}     ${dict.profile.ascendant} ${report.ascendant}`,
        56,
        y,
      );
      y += 28;
      doc.setFontSize(14);
      doc.text(dict.chart.colPlanet, 56, y);
      y += 18;
      doc.setFontSize(10);
      for (const p of report.planets) {
        doc.text(p.name, 56, y);
        doc.text(`${p.sign} ${p.deg}`, 200, y);
        doc.text(`${dict.common.house} ${p.house}${p.retro ? "  ℞" : ""}`, 360, y);
        y += 15;
      }
      y += 12;
      doc.setTextColor(120);
      doc.text(`${report.aspects} aspects · Placidus · tropical`, 56, y);
      doc.save(`${(report.name || "cosmos").replace(/\s+/g, "-").toLowerCase()}-natal-chart.pdf`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" onClick={download} loading={loading}>
      <Download size={13} /> {dict.profile.downloadPdf}
    </Button>
  );
}
