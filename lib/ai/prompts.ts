/* Prompt builders + graceful fallbacks shared by the AI routes. */

const VOICE =
  "Você é Cosmos, um astrólogo experiente. Forneça interpretações precisas, " +
  "poéticas e úteis. Seja específico sobre como esta posição se manifesta na " +
  "vida real. Nunca seja vago. Tom: sábio e encorajador.";

export const INTERPRETATION_SYSTEM = `${VOICE} Máximo 150 palavras.`;

export function interpretationPrompt(p: {
  planet: string;
  sign: string;
  house: number;
  aspects: string[];
}): string {
  const asp = p.aspects.length ? p.aspects.join("; ") : "nenhum aspecto maior";
  return `Interprete ${p.planet} em ${p.sign}, Casa ${p.house}, com os seguintes aspectos: ${asp}.`;
}

export function interpretationFallback(p: { planet: string; sign: string; house: number }): string {
  return (
    `${p.planet} em ${p.sign}, na Casa ${p.house}, colore esta área da vida com a ` +
    `assinatura do signo: instintos e necessidades expressos através de seus temas. ` +
    `Onde ${p.planet} se posiciona, há um chamado para integrar essa energia de forma ` +
    `consciente — honrando tanto o dom quanto o desafio que ela traz. ` +
    `(Interpretação completa por IA quando a ANTHROPIC_API_KEY estiver configurada.)`
  );
}

export const ASK_SYSTEM =
  `${VOICE} Responda à pergunta da pessoa à luz do mapa astral fornecido, em até 120 palavras.`;

export function askPrompt(question: string, context: string): string {
  return `Contexto do mapa astral:\n${context}\n\nPergunta: ${question}`;
}

export function askFallback(question: string): string {
  return (
    `As estrelas sussurram sobre "${question}", mas a voz plena de Cosmos desperta ` +
    `apenas quando a ANTHROPIC_API_KEY é configurada. Por ora, confie no que já sabe: ` +
    `o céu favorece quem escuta antes de agir.`
  );
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

export const HOROSCOPE_SYSTEM =
  `${VOICE} Responda APENAS com JSON válido, sem markdown, sem texto extra.`;

export function horoscopePrompt(sign: string, date: string, transits: string): string {
  return (
    `Gere um horóscopo diário para ${sign} em ${date}. ` +
    `Considere as posições planetárias atuais: ${transits}. ` +
    `Responda APENAS em JSON válido com as chaves: ` +
    `overall (2-3 frases), love (2-3 frases), career (2-3 frases), health (2-3 frases), ` +
    `luckyNumber (number), luckyColor (string), rating (number 1-5), affirmation (1 frase inspiracional).`
  );
}

export function horoscopeFallback(sign: string): HoroscopeContent {
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
