import Anthropic from "@anthropic-ai/sdk";

/** Default: Sonnet. Opus and Fable are blocked — only Haiku and Sonnet are allowed. */
const DEFAULT_MODEL = "claude-sonnet-4-5";

function isAllowedModel(model: string): boolean {
  const m = model.toLowerCase();
  if (m.includes("opus") || m.includes("fable")) return false;
  return m.includes("sonnet") || m.includes("haiku");
}

function resolveModel(): string {
  const env = process.env.ANTHROPIC_MODEL?.trim();
  if (!env) return DEFAULT_MODEL;
  if (!isAllowedModel(env)) {
    console.warn(
      `[Cosmos AI] Model "${env}" is not allowed (Opus/Fable blocked; use Haiku or Sonnet). Falling back to ${DEFAULT_MODEL}.`,
    );
    return DEFAULT_MODEL;
  }
  return env;
}

export const CLAUDE_MODEL = resolveModel();

const apiKey = process.env.ANTHROPIC_API_KEY;
export const aiEnabled = Boolean(apiKey);

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

const encoder = new TextEncoder();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CompletionOpts {
  system: string;
  prompt: string;
  maxTokens?: number;
  /** Returned (as a stream/value) when no API key is configured. */
  fallback: string;
}

interface ChatOpts {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  fallback: string;
}

/** Streams `fallback` word-by-word so the UI behaves the same without a key. */
function fallbackStream(fallback: string): ReadableStream<Uint8Array> {
  const words = fallback.split(/(\s+)/);
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

/** Streams a live Claude completion from a full message array. */
function liveStream(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): ReadableStream<Uint8Array> {
  const c = getClient()!;
  return new ReadableStream({
    async start(controller) {
      try {
        const stream = c.messages.stream({ model: CLAUDE_MODEL, max_tokens: maxTokens, system, messages });
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.warn("[Cosmos AI] stream error:", err instanceof Error ? err.message : err);
        controller.enqueue(encoder.encode("The stars are clouded just now — please try again shortly."));
        controller.close();
      }
    },
  });
}

/**
 * Streams a single-turn Claude completion as UTF-8 chunks. When
 * ANTHROPIC_API_KEY is absent, streams the `fallback` word-by-word.
 */
export function streamCompletion(opts: CompletionOpts): ReadableStream<Uint8Array> {
  if (!getClient()) return fallbackStream(opts.fallback);
  return liveStream(opts.system, [{ role: "user", content: opts.prompt }], opts.maxTokens ?? 400);
}

/**
 * Streams a multi-turn conversation (for follow-up chat). `messages` must
 * alternate user/assistant and start with a user turn.
 */
export function streamChat(opts: ChatOpts): ReadableStream<Uint8Array> {
  if (!getClient()) return fallbackStream(opts.fallback);
  return liveStream(opts.system, opts.messages, opts.maxTokens ?? 800);
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
    // Robust extraction: strip fences, then take the outermost {...} block —
    // survives preambles, trailing prose and code-fence variations.
    const stripped = text.replace(/```(?:json)?/gi, "").trim();
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");
    const json = start >= 0 && end > start ? stripped.slice(start, end + 1) : stripped;
    return JSON.parse(json) as T;
  } catch (err) {
    console.warn("[Cosmos AI] generateJSON fell back:", err instanceof Error ? err.message : err);
    return opts.fallback;
  }
}
