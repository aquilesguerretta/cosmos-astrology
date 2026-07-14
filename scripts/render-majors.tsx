/* Dev tool: renders all 22 Major Arcana cards to a static HTML gallery so the
   hand-drawn scenes can be eyeballed without the app runtime.
   Run: npx tsx scripts/render-majors.tsx  → public/dev-majors.html (gitignored use only) */
import React from "react";
import { writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nProvider } from "../components/i18n/I18nProvider";
import { en } from "../lib/i18n/en";
import { MAJOR_ARCANA } from "../lib/tarot/deck";
import { TarotCardArt } from "../components/tarot/TarotCardArt";

const cards = MAJOR_ARCANA.map((c) =>
  renderToStaticMarkup(
    <I18nProvider locale="en" dict={en}>
      <TarotCardArt card={c} width={150} />
    </I18nProvider>,
  ),
).join("\n");

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Majors gallery</title>
<style>
  body{background:#0A0A0F;margin:24px;font-family:serif}
  .grid{display:grid;grid-template-columns:repeat(6,150px);gap:14px}
  .grid svg{display:block}
</style></head>
<body><div class="grid">${cards}</div></body></html>`;

writeFileSync("public/dev-majors.html", html);
console.log("wrote public/dev-majors.html with", MAJOR_ARCANA.length, "cards");
