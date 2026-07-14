/* The full 78-card tarot deck, bilingual.
   Majors carry individual keywords + a one-line essence.
   Minors are built from the classical number × suit method (also taught in the
   Academy): each pip card = number theme expressed in the suit's domain. */

export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Arcana = "major" | "minor";

export interface LocalizedKeywords {
  up: string[];
  rev: string[];
}

export interface TarotCard {
  id: string; // "major-0" | "wands-1" ... "pentacles-14"
  arcana: Arcana;
  /** Majors 0–21. Minors 1–10 pips, 11 Page, 12 Knight, 13 Queen, 14 King. */
  number: number;
  suit?: Suit;
  name: { en: string; pt: string };
  keywords: { en: LocalizedKeywords; pt: LocalizedKeywords };
  essence?: { en: string; pt: string };
}

/* ───────────────────────── Major Arcana ───────────────────────── */

interface MajorDef {
  n: number;
  en: string;
  pt: string;
  upEn: string[]; revEn: string[];
  upPt: string[]; revPt: string[];
  essEn: string; essPt: string;
}

const MAJORS: MajorDef[] = [
  { n: 0, en: "The Fool", pt: "O Louco",
    upEn: ["beginnings", "leap of faith", "innocence", "freedom"], revEn: ["recklessness", "hesitation", "naivety"],
    upPt: ["começos", "salto de fé", "inocência", "liberdade"], revPt: ["imprudência", "hesitação", "ingenuidade"],
    essEn: "The step taken before the path exists — pure potential at the edge.",
    essPt: "O passo dado antes de existir caminho — potencial puro à beira do abismo." },
  { n: 1, en: "The Magician", pt: "O Mago",
    upEn: ["will", "manifestation", "skill", "focus"], revEn: ["manipulation", "scattered energy", "untapped talent"],
    upPt: ["vontade", "manifestação", "habilidade", "foco"], revPt: ["manipulação", "energia dispersa", "talento parado"],
    essEn: "All four tools on the table, and the hand that dares to use them.",
    essPt: "As quatro ferramentas na mesa, e a mão que ousa usá-las." },
  { n: 2, en: "The High Priestess", pt: "A Sacerdotisa",
    upEn: ["intuition", "mystery", "inner knowing", "stillness"], revEn: ["ignored intuition", "hidden agendas", "surface noise"],
    upPt: ["intuição", "mistério", "saber interior", "quietude"], revPt: ["intuição ignorada", "segredos", "ruído de superfície"],
    essEn: "What is known without being told.",
    essPt: "O que se sabe sem ser dito." },
  { n: 3, en: "The Empress", pt: "A Imperatriz",
    upEn: ["abundance", "nurture", "creation", "fertility"], revEn: ["creative block", "smothering", "dependence"],
    upPt: ["abundância", "acolhimento", "criação", "fertilidade"], revPt: ["bloqueio criativo", "sufocamento", "dependência"],
    essEn: "The garden that grows because it is loved.",
    essPt: "O jardim que cresce porque é amado." },
  { n: 4, en: "The Emperor", pt: "O Imperador",
    upEn: ["structure", "authority", "stability", "order"], revEn: ["rigidity", "control", "tyranny"],
    upPt: ["estrutura", "autoridade", "estabilidade", "ordem"], revPt: ["rigidez", "controle", "tirania"],
    essEn: "The wall that protects — or imprisons.",
    essPt: "A muralha que protege — ou aprisiona." },
  { n: 5, en: "The Hierophant", pt: "O Hierofante",
    upEn: ["tradition", "teaching", "guidance", "belief"], revEn: ["dogma", "rebellion", "empty ritual"],
    upPt: ["tradição", "ensinamento", "orientação", "crença"], revPt: ["dogma", "rebeldia", "ritual vazio"],
    essEn: "Old keys — and the question of which doors still accept them.",
    essPt: "Chaves antigas — e a pergunta de quais portas ainda as aceitam." },
  { n: 6, en: "The Lovers", pt: "Os Enamorados",
    upEn: ["union", "choice", "alignment", "values"], revEn: ["misalignment", "avoided choice", "disharmony"],
    upPt: ["união", "escolha", "alinhamento", "valores"], revPt: ["desalinhamento", "escolha evitada", "desarmonia"],
    essEn: "A choice that defines who you become.",
    essPt: "Uma escolha que define quem você se torna." },
  { n: 7, en: "The Chariot", pt: "O Carro",
    upEn: ["willpower", "victory", "direction", "discipline"], revEn: ["scattered forces", "loss of control", "stalling"],
    upPt: ["força de vontade", "vitória", "direção", "disciplina"], revPt: ["forças dispersas", "perda de controle", "estagnação"],
    essEn: "Two horses pulling apart; one driver holding the line.",
    essPt: "Dois cavalos puxando para lados opostos; um condutor segurando a linha." },
  { n: 8, en: "Strength", pt: "A Força",
    upEn: ["courage", "gentle power", "patience", "self-mastery"], revEn: ["self-doubt", "raw reaction", "forcing"],
    upPt: ["coragem", "poder gentil", "paciência", "autodomínio"], revPt: ["insegurança", "reação bruta", "forçar a barra"],
    essEn: "The lion tamed by a steady hand, not a whip.",
    essPt: "O leão domado por mão firme, não por chicote." },
  { n: 9, en: "The Hermit", pt: "O Eremita",
    upEn: ["introspection", "solitude", "inner guidance", "wisdom"], revEn: ["isolation", "withdrawal", "refusing counsel"],
    upPt: ["introspecção", "solitude", "guia interior", "sabedoria"], revPt: ["isolamento", "retraimento", "recusar conselho"],
    essEn: "A lamp lit for a road only you can walk.",
    essPt: "Uma lamparina acesa para uma estrada que só você pode andar." },
  { n: 10, en: "Wheel of Fortune", pt: "A Roda da Fortuna",
    upEn: ["cycles", "turning point", "fate", "timing"], revEn: ["resisting change", "a bad turn", "repetition"],
    upPt: ["ciclos", "ponto de virada", "destino", "tempo certo"], revPt: ["resistir à mudança", "má virada", "repetição"],
    essEn: "The turn you did not choose — and what you do with it.",
    essPt: "A virada que você não escolheu — e o que você faz com ela." },
  { n: 11, en: "Justice", pt: "A Justiça",
    upEn: ["truth", "fairness", "cause and effect", "accountability"], revEn: ["dishonesty", "imbalance", "avoiding consequences"],
    upPt: ["verdade", "justiça", "causa e efeito", "responsabilidade"], revPt: ["desonestidade", "desequilíbrio", "fugir das consequências"],
    essEn: "The scale weighs what was actually done, not what was meant.",
    essPt: "A balança pesa o que foi feito, não o que se pretendia." },
  { n: 12, en: "The Hanged Man", pt: "O Enforcado",
    upEn: ["surrender", "new perspective", "pause", "letting go"], revEn: ["useless sacrifice", "martyrdom", "stalling"],
    upPt: ["entrega", "nova perspectiva", "pausa", "soltar"], revPt: ["sacrifício inútil", "martírio", "adiamento"],
    essEn: "Upside down, the world finally makes sense.",
    essPt: "De cabeça para baixo, o mundo enfim faz sentido." },
  { n: 13, en: "Death", pt: "A Morte",
    upEn: ["ending", "transformation", "release", "renewal"], revEn: ["clinging", "stagnation", "fear of change"],
    upPt: ["fim", "transformação", "desapego", "renovação"], revPt: ["apego", "estagnação", "medo da mudança"],
    essEn: "Nothing new grows from an unfinished ending.",
    essPt: "Nada novo cresce de um fim que não terminou." },
  { n: 14, en: "Temperance", pt: "A Temperança",
    upEn: ["balance", "patience", "synthesis", "moderation"], revEn: ["excess", "impatience", "discord"],
    upPt: ["equilíbrio", "paciência", "síntese", "moderação"], revPt: ["excesso", "impaciência", "discórdia"],
    essEn: "Two cups, one water — the art of the middle way.",
    essPt: "Duas taças, uma água — a arte do caminho do meio." },
  { n: 15, en: "The Devil", pt: "O Diabo",
    upEn: ["attachment", "desire", "bondage", "materialism"], revEn: ["breaking chains", "release", "reclaimed power"],
    upPt: ["apego", "desejo", "aprisionamento", "materialismo"], revPt: ["quebrar correntes", "libertação", "poder retomado"],
    essEn: "The chain is loose enough to lift — look down.",
    essPt: "A corrente está frouxa o bastante para tirar — olhe para baixo." },
  { n: 16, en: "The Tower", pt: "A Torre",
    upEn: ["sudden upheaval", "revelation", "collapse of the false"], revEn: ["disaster postponed", "fear of collapse", "resisting demolition"],
    upPt: ["ruptura súbita", "revelação", "queda do falso"], revPt: ["desastre adiado", "medo da queda", "resistir à demolição"],
    essEn: "What the lightning destroys was already hollow.",
    essPt: "O que o raio destrói já estava oco." },
  { n: 17, en: "The Star", pt: "A Estrela",
    upEn: ["hope", "healing", "renewal", "guidance"], revEn: ["discouragement", "lost faith", "disconnection"],
    upPt: ["esperança", "cura", "renovação", "orientação"], revPt: ["desânimo", "fé perdida", "desconexão"],
    essEn: "After the tower, the sky.",
    essPt: "Depois da torre, o céu." },
  { n: 18, en: "The Moon", pt: "A Lua",
    upEn: ["illusion", "dreams", "the unconscious", "uncertainty"], revEn: ["clarity emerging", "fear dissolving", "deception revealed"],
    upPt: ["ilusão", "sonhos", "o inconsciente", "incerteza"], revPt: ["clareza emergindo", "medo dissolvendo", "engano revelado"],
    essEn: "The path is real; the shapes beside it may not be.",
    essPt: "O caminho é real; as formas ao lado talvez não sejam." },
  { n: 19, en: "The Sun", pt: "O Sol",
    upEn: ["joy", "vitality", "success", "clarity"], revEn: ["dimmed joy", "delays", "forced positivity"],
    upPt: ["alegria", "vitalidade", "sucesso", "clareza"], revPt: ["alegria apagada", "atrasos", "positividade forçada"],
    essEn: "Everything visible, nothing to hide.",
    essPt: "Tudo visível, nada a esconder." },
  { n: 20, en: "Judgement", pt: "O Julgamento",
    upEn: ["awakening", "reckoning", "a calling", "rebirth"], revEn: ["ignoring the call", "harsh self-judgement", "doubt"],
    upPt: ["despertar", "acerto de contas", "um chamado", "renascimento"], revPt: ["ignorar o chamado", "autocrítica dura", "dúvida"],
    essEn: "The trumpet asks: rise — as whom, exactly?",
    essPt: "A trombeta pergunta: levantar-se — como quem, exatamente?" },
  { n: 21, en: "The World", pt: "O Mundo",
    upEn: ["completion", "integration", "achievement", "wholeness"], revEn: ["loose ends", "incompletion", "almost there"],
    upPt: ["conclusão", "integração", "realização", "inteireza"], revPt: ["pontas soltas", "incompletude", "quase lá"],
    essEn: "The circle closes so a larger one can open.",
    essPt: "O círculo se fecha para que um maior se abra." },
];

/* ───────────────────────── Minor Arcana method ───────────────────────── */

export const SUIT_INFO: Record<Suit, {
  name: { en: string; pt: string };
  element: { en: string; pt: string };
  domain: { en: string; pt: string };
}> = {
  wands: {
    name: { en: "Wands", pt: "Paus" },
    element: { en: "Fire", pt: "Fogo" },
    domain: { en: "will, work, creativity, drive", pt: "vontade, trabalho, criatividade, impulso" },
  },
  cups: {
    name: { en: "Cups", pt: "Copas" },
    element: { en: "Water", pt: "Água" },
    domain: { en: "emotions, love, intuition, bonds", pt: "emoções, amor, intuição, vínculos" },
  },
  swords: {
    name: { en: "Swords", pt: "Espadas" },
    element: { en: "Air", pt: "Ar" },
    domain: { en: "mind, truth, conflict, decisions", pt: "mente, verdade, conflito, decisões" },
  },
  pentacles: {
    name: { en: "Pentacles", pt: "Ouros" },
    element: { en: "Earth", pt: "Terra" },
    domain: { en: "body, money, craft, material life", pt: "corpo, dinheiro, ofício, vida material" },
  },
};

interface Theme {
  label: { en: string; pt: string };
  upEn: string[]; revEn: string[];
  upPt: string[]; revPt: string[];
}

export const NUMBER_THEMES: Record<number, Theme> = {
  1: { label: { en: "Ace", pt: "Ás" },
    upEn: ["a seed", "pure potential", "an opening"], revEn: ["a missed opening", "false start", "wasted gift"],
    upPt: ["uma semente", "potencial puro", "uma abertura"], revPt: ["abertura perdida", "falso começo", "dom desperdiçado"] },
  2: { label: { en: "Two", pt: "Dois" },
    upEn: ["duality", "choice", "balance found"], revEn: ["indecision", "imbalance", "stalemate"],
    upPt: ["dualidade", "escolha", "equilíbrio encontrado"], revPt: ["indecisão", "desequilíbrio", "impasse"] },
  3: { label: { en: "Three", pt: "Três" },
    upEn: ["growth", "collaboration", "first results"], revEn: ["delay", "misalignment", "scattered effort"],
    upPt: ["crescimento", "colaboração", "primeiros frutos"], revPt: ["atraso", "desalinhamento", "esforço disperso"] },
  4: { label: { en: "Four", pt: "Quatro" },
    upEn: ["stability", "consolidation", "a pause"], revEn: ["stagnation", "gripping too tight", "restlessness"],
    upPt: ["estabilidade", "consolidação", "uma pausa"], revPt: ["estagnação", "apego excessivo", "inquietação"] },
  5: { label: { en: "Five", pt: "Cinco" },
    upEn: ["friction", "challenge", "a loss that teaches"], revEn: ["recovery", "avoided conflict", "a lesson refused"],
    upPt: ["fricção", "desafio", "perda que ensina"], revPt: ["recuperação", "conflito evitado", "lição recusada"] },
  6: { label: { en: "Six", pt: "Seis" },
    upEn: ["harmony restored", "generosity", "movement forward"], revEn: ["uneven exchange", "nostalgia", "delayed progress"],
    upPt: ["harmonia restaurada", "generosidade", "avanço"], revPt: ["troca desigual", "nostalgia", "progresso adiado"] },
  7: { label: { en: "Seven", pt: "Sete" },
    upEn: ["assessment", "patience", "strategy"], revEn: ["impatience", "scattered defense", "self-doubt"],
    upPt: ["avaliação", "paciência", "estratégia"], revPt: ["impaciência", "defesa dispersa", "dúvida"] },
  8: { label: { en: "Eight", pt: "Oito" },
    upEn: ["skilled effort", "momentum", "dedication"], revEn: ["burnout", "trapped thinking", "a hasty exit"],
    upPt: ["esforço hábil", "impulso", "dedicação"], revPt: ["exaustão", "pensamento aprisionado", "saída precipitada"] },
  9: { label: { en: "Nine", pt: "Nove" },
    upEn: ["fruition", "resilience", "nearly there"], revEn: ["anxiety", "weariness", "a guarded heart"],
    upPt: ["fruição", "resiliência", "quase lá"], revPt: ["ansiedade", "cansaço", "coração em guarda"] },
  10: { label: { en: "Ten", pt: "Dez" },
    upEn: ["completion", "culmination", "legacy"], revEn: ["overload", "an ending resisted", "a burden carried too far"],
    upPt: ["conclusão", "culminação", "legado"], revPt: ["sobrecarga", "fim resistido", "fardo carregado demais"] },
};

export const RANK_THEMES: Record<number, Theme> = {
  11: { label: { en: "Page", pt: "Valete" },
    upEn: ["a message", "curiosity", "a student's eyes"], revEn: ["immaturity", "gossip", "untrained talent"],
    upPt: ["uma mensagem", "curiosidade", "olhos de aprendiz"], revPt: ["imaturidade", "fofoca", "talento sem treino"] },
  12: { label: { en: "Knight", pt: "Cavaleiro" },
    upEn: ["pursuit", "action", "a quest"], revEn: ["haste or stalling", "obsession", "misdirected energy"],
    upPt: ["busca", "ação", "uma missão"], revPt: ["pressa ou lentidão", "obsessão", "energia mal dirigida"] },
  13: { label: { en: "Queen", pt: "Rainha" },
    upEn: ["mastery turned inward", "nurture", "magnetic presence"], revEn: ["moodiness", "smothering", "self-neglect"],
    upPt: ["maestria voltada para dentro", "acolhimento", "presença magnética"], revPt: ["humor instável", "sufocamento", "autoabandono"] },
  14: { label: { en: "King", pt: "Rei" },
    upEn: ["mastery turned outward", "command", "mature power"], revEn: ["control", "coldness", "abuse of position"],
    upPt: ["maestria voltada para fora", "comando", "poder maduro"], revPt: ["controle", "frieza", "abuso de posição"] },
};

const SUITS: Suit[] = ["wands", "cups", "swords", "pentacles"];

function buildMinor(suit: Suit, number: number): TarotCard {
  const theme = number <= 10 ? NUMBER_THEMES[number] : RANK_THEMES[number];
  const suitInfo = SUIT_INFO[suit];
  return {
    id: `${suit}-${number}`,
    arcana: "minor",
    number,
    suit,
    name: {
      en: `${theme.label.en} of ${suitInfo.name.en}`,
      pt: `${theme.label.pt} de ${suitInfo.name.pt}`,
    },
    keywords: {
      en: { up: theme.upEn, rev: theme.revEn },
      pt: { up: theme.upPt, rev: theme.revPt },
    },
  };
}

export const MAJOR_ARCANA: TarotCard[] = MAJORS.map((m) => ({
  id: `major-${m.n}`,
  arcana: "major",
  number: m.n,
  name: { en: m.en, pt: m.pt },
  keywords: { en: { up: m.upEn, rev: m.revEn }, pt: { up: m.upPt, rev: m.revPt } },
  essence: { en: m.essEn, pt: m.essPt },
}));

export const MINOR_ARCANA: TarotCard[] = SUITS.flatMap((suit) =>
  Array.from({ length: 14 }, (_, i) => buildMinor(suit, i + 1)),
);

export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const CARD_BY_ID: Record<string, TarotCard> = Object.fromEntries(
  FULL_DECK.map((c) => [c.id, c]),
);

export const ROMAN_MAJOR = (n: number) => {
  if (n === 0) return "0";
  const R = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return R[n];
};
