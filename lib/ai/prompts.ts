/* Locale-aware prompt builders + graceful fallbacks for the AI routes. */

export type PromptLocale = "en" | "pt";

const VOICE: Record<PromptLocale, string> = {
  pt:
    "Você é Cosmos, um astrólogo experiente. Forneça interpretações precisas, " +
    "poéticas e úteis. Seja específico sobre como esta posição se manifesta na " +
    "vida real. Nunca seja vago. Tom: sábio e encorajador. Responda em português. " +
    "Use prosa corrida apenas — sem markdown, sem títulos, sem listas com marcadores.",
  en:
    "You are Cosmos, a seasoned astrologer. Give precise, poetic, useful " +
    "interpretations. Be specific about how this placement shows up in real " +
    "life. Never be vague. Tone: wise and encouraging. Answer in English. " +
    "Use plain flowing prose only — no markdown, no headings, no bullet lists.",
};

export function interpretationSystem(locale: PromptLocale): string {
  return `${VOICE[locale]} ${locale === "pt" ? "Máximo 150 palavras." : "150 words maximum."}`;
}

export function interpretationPrompt(
  locale: PromptLocale,
  p: { planet: string; sign: string; house: number; aspects: string[] },
): string {
  const asp = p.aspects.length
    ? p.aspects.join("; ")
    : locale === "pt"
      ? "nenhum aspecto maior"
      : "no major aspects";
  return locale === "pt"
    ? `Interprete ${p.planet} em ${p.sign}, Casa ${p.house}, com os seguintes aspectos: ${asp}.`
    : `Interpret ${p.planet} in ${p.sign}, House ${p.house}, with the following aspects: ${asp}.`;
}

export function interpretationFallback(
  locale: PromptLocale,
  p: { planet: string; sign: string; house: number },
): string {
  return locale === "pt"
    ? `${p.planet} em ${p.sign}, na Casa ${p.house}, colore esta área da vida com a ` +
      `assinatura do signo: instintos e necessidades expressos através de seus temas. ` +
      `Onde ${p.planet} se posiciona, há um chamado para integrar essa energia de forma ` +
      `consciente — honrando tanto o dom quanto o desafio que ela traz. ` +
      `(Interpretação completa por IA quando a ANTHROPIC_API_KEY estiver configurada.)`
    : `${p.planet} in ${p.sign}, in House ${p.house}, colors this area of life with the ` +
      `sign's signature: instincts and needs expressed through its themes. Where ` +
      `${p.planet} stands, there is a call to integrate that energy consciously — ` +
      `honoring both the gift and the challenge it brings. ` +
      `(Full AI interpretation arrives once ANTHROPIC_API_KEY is configured.)`;
}

export function askSystem(locale: PromptLocale): string {
  return `${VOICE[locale]} ${
    locale === "pt"
      ? "Responda à pergunta da pessoa à luz do mapa astral fornecido, em até 120 palavras."
      : "Answer the person's question in light of the provided chart, in at most 120 words."
  }`;
}

export function askPrompt(locale: PromptLocale, question: string, context: string): string {
  return locale === "pt"
    ? `Contexto do mapa astral:\n${context}\n\nPergunta: ${question}`
    : `Chart context:\n${context}\n\nQuestion: ${question}`;
}

export function askFallback(locale: PromptLocale, question: string): string {
  return locale === "pt"
    ? `As estrelas sussurram sobre "${question}", mas a voz plena de Cosmos desperta ` +
      `apenas quando a ANTHROPIC_API_KEY é configurada. Por ora, confie no que já sabe: ` +
      `o céu favorece quem escuta antes de agir.`
    : `The stars whisper about "${question}", but Cosmos's full voice wakes only when ` +
      `ANTHROPIC_API_KEY is configured. For now, trust what you already know: the sky ` +
      `favors those who listen before acting.`;
}

export interface HoroscopeContent {
  overall: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  rating: number;
  affirmation: string;
}

export function horoscopeSystem(locale: PromptLocale): string {
  return `${VOICE[locale]} ${
    locale === "pt"
      ? "Responda APENAS com JSON válido, sem markdown, sem texto extra."
      : "Answer ONLY with valid JSON — no markdown, no extra text."
  }`;
}

export function horoscopePrompt(
  locale: PromptLocale,
  sign: string,
  date: string,
  transits: string,
): string {
  return locale === "pt"
    ? `Gere um horóscopo diário para ${sign} em ${date}. ` +
      `Considere as posições planetárias atuais: ${transits}. ` +
      `Responda APENAS em JSON válido com as chaves: ` +
      `overall (2-3 frases), love (2-3 frases), career (2-3 frases), health (2-3 frases), ` +
      `luckyNumber (number), luckyColor (string), rating (number 1-5), affirmation (1 frase inspiracional).`
    : `Write a daily horoscope for ${sign} on ${date}. ` +
      `Consider today's planetary positions: ${transits}. ` +
      `Answer ONLY with valid JSON with the keys: ` +
      `overall (2-3 sentences), love (2-3 sentences), career (2-3 sentences), health (2-3 sentences), ` +
      `luckyNumber (number), luckyColor (string), rating (number 1-5), affirmation (1 inspirational sentence).`;
}

export function horoscopeFallback(locale: PromptLocale, sign: string): HoroscopeContent {
  if (locale === "pt") {
    return {
      overall: `${sign} encontra hoje um céu de transição — pequenos ajustes rendem mais que grandes gestos. Observe antes de decidir.`,
      love: `No amor, a sinceridade abre portas que a estratégia fecha. Diga o que sente sem ensaiar demais.`,
      career: `No trabalho, conclua o que ficou pendente antes de abraçar o novo. Uma mensagem chega ao meio-dia.`,
      health: `Hidrate-se e caminhe ao entardecer. O corpo pede ritmo, não pressa.`,
      luckyNumber: 7,
      luckyColor: "Dourado",
      rating: 4,
      affirmation: "Eu confio no tempo das coisas.",
    };
  }
  return {
    overall: `${sign} meets a sky in transition today — small adjustments pay more than grand gestures. Observe before deciding.`,
    love: `In love, sincerity opens doors that strategy closes. Say what you feel without over-rehearsing.`,
    career: `At work, finish what is pending before embracing the new. A message arrives around noon.`,
    health: `Hydrate and walk at dusk. The body asks for rhythm, not haste.`,
    luckyNumber: 7,
    luckyColor: "Gold",
    rating: 4,
    affirmation: "I trust the timing of things.",
  };
}
