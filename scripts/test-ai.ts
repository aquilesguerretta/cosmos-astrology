/**
 * Smoke-test every AI-backed API route. Run with dev server up:
 *   npx tsx scripts/test-ai.ts
 */

const BASE = process.env.TEST_BASE ?? "http://localhost:3000";

type Result = { name: string; ok: boolean; detail: string };

async function readStream(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += dec.decode(value, { stream: true });
  }
  return out.trim();
}

async function testAsk(): Promise<Result> {
  const res = await fetch(`${BASE}/api/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "What does my Sun in Leo mean for creativity?",
      context: "Sun in Leo, House 5. Moon in Pisces, House 12. Ascendant Scorpio.",
    }),
  });
  const text = await readStream(res);
  const fallback = text.includes("ANTHROPIC_API_KEY");
  const ok = res.ok && text.length > 80 && !fallback;
  return {
    name: "Ask the Stars (/api/ai/ask)",
    ok,
    detail: ok ? `${text.slice(0, 120)}…` : `status=${res.status} fallback=${fallback} len=${text.length}`,
  };
}

async function testChartInterpret(locale: "en" | "pt"): Promise<Result> {
  const res = await fetch(`${BASE}/api/chart/interpret`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `cosmos-locale=${locale}`,
    },
    body: JSON.stringify({
      planet: locale === "pt" ? "Sol" : "Sun",
      sign: locale === "pt" ? "Leão" : "Leo",
      house: 5,
      aspects: locale === "pt" ? ["trígono Júpiter"] : ["trine Jupiter"],
    }),
  });
  const text = await readStream(res);
  const ptHints = /\b(você|sua|seu|com|para|uma|não)\b/i.test(text);
  const enHints = /\b(you|your|the|with|this|are)\b/i.test(text);
  const localeOk = locale === "pt" ? ptHints && !/\bYou were\b/.test(text) : enHints;
  const ok = res.ok && text.length > 80 && localeOk && !text.includes("ANTHROPIC_API_KEY");
  return {
    name: `Chart interpret [${locale.toUpperCase()}]`,
    ok,
    detail: ok ? `${text.slice(0, 100)}…` : `status=${res.status} localeOk=${localeOk} len=${text.length}`,
  };
}

async function testHoroscopeLocale(locale: "en" | "pt"): Promise<Result> {
  const res = await fetch(`${BASE}/api/horoscope?sign=leo&date=2026-07-15`, {
    headers: { Cookie: `cosmos-locale=${locale}` },
  });
  const json = (await res.json()) as Record<string, unknown>;
  const overall = String(json.overall ?? "");
  const ptHints = /\b(você|hoje|seu|uma|com)\b/i.test(overall);
  const enHints = /\b(you|your|today|the|with)\b/i.test(overall);
  const localeOk = locale === "pt" ? ptHints : enHints;
  const ok = res.ok && overall.length > 20 && localeOk;
  return {
    name: `Horoscope [${locale.toUpperCase()}]`,
    ok,
    detail: ok ? overall.slice(0, 90) + "…" : `status=${res.status} localeOk=${localeOk}`,
  };
}

async function testTarot(): Promise<Result> {
  const res = await fetch(`${BASE}/api/tarot/interpret`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "What should I focus on this week?",
      spread: "three-card",
      cards: [
        { id: "major-0", position: "Past", reversed: false },
        { id: "major-13", position: "Present", reversed: true },
        { id: "major-21", position: "Future", reversed: false },
      ],
    }),
  });
  const text = await readStream(res);
  const fallback = text.includes("ANTHROPIC_API_KEY");
  const ok = res.ok && text.length > 100 && !fallback;
  return {
    name: "Tarot interpret (/api/tarot/interpret)",
    ok,
    detail: ok ? `${text.slice(0, 120)}…` : `status=${res.status} fallback=${fallback} len=${text.length}`,
  };
}

async function testHoroscope(): Promise<Result> {
  const res = await fetch(`${BASE}/api/horoscope?sign=leo&date=2026-07-14`);
  const json = (await res.json()) as Record<string, unknown>;
  const fallback =
    typeof json.overall === "string" &&
    (json.overall as string).includes("transição") &&
    json.luckyNumber === 7;
  const ok =
    res.ok &&
    typeof json.overall === "string" &&
    typeof json.love === "string" &&
    typeof json.rating === "number" &&
    !fallback;
  return {
    name: "Daily horoscope (/api/horoscope)",
    ok,
    detail: ok
      ? `rating=${json.rating} overall=${String(json.overall).slice(0, 80)}…`
      : `status=${res.status} fallback=${fallback} keys=${Object.keys(json).join(",")}`,
  };
}

async function main() {
  console.log(`Testing AI routes at ${BASE}\n`);
  const results = await Promise.all([
    testAsk(),
    testChartInterpret("en"),
    testChartInterpret("pt"),
    testTarot(),
    testHoroscope(),
    testHoroscopeLocale("en"),
    testHoroscopeLocale("pt"),
  ]);
  for (const r of results) {
    console.log(r.ok ? "✓" : "✗", r.name);
    console.log(" ", r.detail, "\n");
  }
  const failed = results.filter((r) => !r.ok);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
