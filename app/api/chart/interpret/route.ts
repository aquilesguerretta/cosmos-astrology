import {
  streamCompletion,
  INTERPRETATION_SYSTEM,
  interpretationPrompt,
  interpretationFallback,
} from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const planet = String(body.planet ?? "").slice(0, 40);
  const sign = String(body.sign ?? "").slice(0, 40);
  const house = Number(body.house ?? 0);
  const aspects: string[] = Array.isArray(body.aspects)
    ? body.aspects.slice(0, 12).map((a: unknown) => String(a).slice(0, 60))
    : [];

  const stream = streamCompletion({
    system: INTERPRETATION_SYSTEM,
    prompt: interpretationPrompt({ planet, sign, house, aspects }),
    maxTokens: 320,
    fallback: interpretationFallback({ planet, sign, house }),
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
