import { z } from "zod";
import { getLocale } from "@/lib/i18n";
import { streamChat, type ChatMessage } from "@/lib/ai";
import { CARD_BY_ID } from "@/lib/tarot/deck";

const Schema = z.object({
  question: z.string().max(500).optional(),
  spread: z.string().max(40),
  cards: z
    .array(
      z.object({
        id: z.string().max(30),
        position: z.string().max(80),
        reversed: z.boolean(),
      }),
    )
    .min(1)
    .max(10),
  /** Prior conversation for follow-up turns. Starts with the assistant reading
   *  and alternates. Absent/empty ⇒ this is the initial reading. */
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(24000),
      }),
    )
    .max(24)
    .optional(),
});

const VOICE = {
  pt:
    "Você é Cosmos, um tarólogo experiente e direto. Leia as cartas com total honestidade — " +
    "incluindo mensagens difíceis, perdas, finais e avisos. Nunca suavize nem esconda o que as " +
    "cartas mostram; nada de clichês reconfortantes ou respostas evasivas. Seja específico: conecte " +
    "cada carta à sua posição e à pergunta, mostre como as cartas conversam entre si, e feche com " +
    "uma síntese franca e um conselho prático. A pessoa mantém sempre o próprio livre-arbítrio — " +
    "as cartas mostram tendências, não sentenças. Tom: franco, sábio, sem julgamento. Responda em português. " +
    "Use prosa corrida apenas — sem markdown, sem títulos, sem listas. " +
    "Nas perguntas de seguimento, responda com base nestas mesmas cartas, sem repetir a leitura inteira.",
  en:
    "You are Cosmos, a seasoned, plain-spoken tarot reader. Read with complete honesty — including " +
    "hard messages, losses, endings and warnings. Never soften or hide what the cards show; no " +
    "comforting clichés or evasive answers. Be specific: tie each card to its position and to the " +
    "question, show how the cards speak to each other, and close with a frank synthesis and one " +
    "practical piece of advice. The querent always keeps free will — cards show currents, not " +
    "sentences. Tone: frank, wise, non-judgmental. Answer in English. " +
    "Use plain flowing prose only — no markdown, no headings, no bullet lists. " +
    "For follow-up questions, answer from these same cards without repeating the whole reading.",
};

export async function POST(req: Request) {
  const locale = await getLocale();
  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return new Response("Invalid reading.", { status: 400 });
  }
  const { question, spread, cards, messages } = parsed.data;

  const lines = cards.map((c) => {
    const card = CARD_BY_ID[c.id];
    if (!card) return null;
    const kw = card.keywords[locale][c.reversed ? "rev" : "up"].join(", ");
    const rev = c.reversed ? (locale === "pt" ? " (invertida)" : " (reversed)") : "";
    const essence = card.essence ? ` — ${card.essence[locale]}` : "";
    return `${c.position}: ${card.name[locale]}${rev} [${kw}]${essence}`;
  });
  if (lines.some((l) => l === null)) {
    return new Response("Unknown card.", { status: 400 });
  }

  // The spread lives in the system prompt so it persists across follow-ups.
  const q = question?.trim() || (locale === "pt" ? "(nenhuma — leitura geral)" : "(none — general reading)");
  const spreadContext =
    locale === "pt"
      ? `\n\nTiragem em curso: ${spread}. Pergunta original: ${q}.\nCartas:\n${lines.join("\n")}`
      : `\n\nCurrent spread: ${spread}. Original question: ${q}.\nCards:\n${lines.join("\n")}`;
  const system = VOICE[locale] + spreadContext;

  const history = (messages ?? []) as ChatMessage[];
  const isInitial = history.length === 0;
  const initialUser =
    locale === "pt" ? "Faça a leitura completa das cartas." : "Give the full reading of the cards.";
  const chat: ChatMessage[] = [{ role: "user", content: initialUser }, ...history];

  // Generous ceiling for the reading (each card adds detail); focused answers
  // on follow-ups.
  const maxTokens = isInitial ? Math.min(600 + cards.length * 220, 3200) : 900;

  const fallbackList = cards
    .map((c) => {
      const card = CARD_BY_ID[c.id]!;
      const kw = card.keywords[locale][c.reversed ? "rev" : "up"].join(", ");
      return `${c.position} — ${card.name[locale]}${c.reversed ? (locale === "pt" ? " (invertida)" : " (reversed)") : ""}: ${kw}.`;
    })
    .join(" ");
  const fallback = isInitial
    ? locale === "pt"
      ? `${fallbackList} Lidas em conjunto, as cartas pedem que você olhe a situação sem adornos: honre o que terminou, nomeie o que resiste, e aja sobre o que está ao seu alcance. (A leitura completa e personalizada desperta quando a ANTHROPIC_API_KEY estiver configurada.)`
      : `${fallbackList} Read together, the cards ask you to see the situation without ornament: honor what has ended, name what resists, and act on what is within reach. (The full personalized reading wakes once ANTHROPIC_API_KEY is configured.)`
    : locale === "pt"
      ? "A voz plena de Cosmos para o diálogo desperta quando a ANTHROPIC_API_KEY estiver configurada."
      : "Cosmos's full conversational voice wakes once ANTHROPIC_API_KEY is configured.";

  const stream = streamChat({ system, messages: chat, maxTokens, fallback });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
