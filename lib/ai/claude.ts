import Anthropic from "@anthropic-ai/sdk";

/** Model is overridable via env; defaults to a current Sonnet. */
export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

const apiKey = process.env.ANTHROPIC_API_KEY;
export const aiEnabled = Boolean(apiKey);

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

const encoder = new TextEncoder();

interface CompletionOpts {
  system: string;
  prompt: string;
  maxTokens?: number;
  /** Returned (as a stream/value) when no API key is configured. */
  fallback: string;
}

/**
 * Streams a Claude completion as a ReadableStream of UTF-8 chunks.
 * When ANTHROPIC_API_KEY is absent, streams the `fallback` word-by-word so the
 * UI behaves identically in local dev.
 */
export function streamCompletion(opts: CompletionOpts): ReadableStream<Uint8Array> {
  const c = getClient();

  if (!c) {
    const words = opts.fallback.split(/(\s+)/);
    return new ReadableStream({
      async start(controller) {
        for (const w of words) {
          controller.enqueue(encoder.encode(w));
          await new Promise((r) => setTimeout(r, 12));
        }
        controller.close();
      },
    });
  }

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = c.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: opts.maxTokens ?? 400,
          system: opts.system,
          messages: [{ role: "user", content: opts.prompt }],
        });
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.enqueue(encoder.encode("The stars are clouded just now — please try again shortly."));
        controller.close();
      }
    },
  });
}

/** One-shot JSON completion. Returns `fallback` when no key or on parse error. */
export async function generateJSON<T>(opts: {
  system: string;
  prompt: string;
  maxTokens?: number;
  fallback: T;
}): Promise<T> {
  const c = getClient();
  if (!c) return opts.fallback;
  try {
    const msg = await c.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: opts.maxTokens ?? 700,
      system: opts.system,
      messages: [{ role: "user", content: opts.prompt }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const json = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    return JSON.parse(json) as T;
  } catch {
    return opts.fallback;
  }
}
