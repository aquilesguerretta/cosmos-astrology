import { streamCompletion, ASK_SYSTEM, askPrompt, askFallback } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const question = String(body.question ?? "").slice(0, 500).trim();
  const context = String(body.context ?? "").slice(0, 2000);

  if (!question) {
    return new Response("Ask the stars a question.", { status: 400 });
  }

  const stream = streamCompletion({
    system: ASK_SYSTEM,
    prompt: askPrompt(question, context),
    maxTokens: 320,
    fallback: askFallback(question),
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
