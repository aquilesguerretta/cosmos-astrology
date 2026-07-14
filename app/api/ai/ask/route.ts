import { getLocale } from "@/lib/i18n";
import { streamCompletion, askSystem, askPrompt, askFallback } from "@/lib/ai";

export async function POST(req: Request) {
  const locale = await getLocale();
  const body = await req.json().catch(() => ({}));
  const question = String(body.question ?? "").slice(0, 500).trim();
  // Full-chart daily context (all placements + today's sky) runs long.
  const context = String(body.context ?? "").slice(0, 3500);

  if (!question) {
    return new Response("Ask the stars a question.", { status: 400 });
  }

  const stream = streamCompletion({
    system: askSystem(locale),
    prompt: askPrompt(locale, question, context),
    maxTokens: 450,
    fallback: askFallback(locale, question),
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
