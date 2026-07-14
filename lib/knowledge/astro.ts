/* The astrology reference library — bilingual study entries used by /library. */
import type { Planet, ZodiacSign, AspectType } from "@/lib/astrology";

interface L { en: string; pt: string }
interface LK { en: string[]; pt: string[] }

export interface SignEntry {
  sign: ZodiacSign;
  keywords: LK;
  desc: L;
}

export interface PlanetEntry {
  planet: Planet;
  keywords: LK;
  desc: L;
}

export interface HouseEntry {
  house: number;
  title: L;
  keywords: LK;
  desc: L;
}

export interface AspectEntry {
  type: AspectType;
  angle: number;
  orb: number;
  nature: "harmonious" | "tense" | "neutral";
  desc: L;
}

export const SIGN_ENTRIES: SignEntry[] = [
  { sign: "aries", keywords: { en: ["initiative", "courage", "directness"], pt: ["iniciativa", "coragem", "franqueza"] },
    desc: { en: "Cardinal fire ruled by Mars: the impulse that starts things. Aries acts first and understands by moving — its lesson is patience and follow-through.",
            pt: "Fogo cardinal regido por Marte: o impulso que inicia. Áries age primeiro e entende em movimento — sua lição é a paciência e a constância." } },
  { sign: "taurus", keywords: { en: ["stability", "senses", "persistence"], pt: ["estabilidade", "sentidos", "persistência"] },
    desc: { en: "Fixed earth ruled by Venus: value, beauty and what endures. Taurus builds slowly and holds firmly — its lesson is knowing when holding becomes stubbornness.",
            pt: "Terra fixa regida por Vênus: valor, beleza e o que dura. Touro constrói devagar e segura firme — sua lição é saber quando segurar vira teimosia." } },
  { sign: "gemini", keywords: { en: ["curiosity", "language", "duality"], pt: ["curiosidade", "linguagem", "dualidade"] },
    desc: { en: "Mutable air ruled by Mercury: the connector. Gemini collects, translates and links — its lesson is depth: choosing one thread and following it.",
            pt: "Ar mutável regido por Mercúrio: o conector. Gêmeos coleta, traduz e liga — sua lição é a profundidade: escolher um fio e segui-lo." } },
  { sign: "cancer", keywords: { en: ["care", "memory", "belonging"], pt: ["cuidado", "memória", "pertencimento"] },
    desc: { en: "Cardinal water ruled by the Moon: the tide of feeling and home. Cancer protects what it loves — its lesson is letting the shell open.",
            pt: "Água cardinal regida pela Lua: a maré do sentir e do lar. Câncer protege o que ama — sua lição é deixar a concha se abrir." } },
  { sign: "leo", keywords: { en: ["radiance", "creation", "loyalty"], pt: ["brilho", "criação", "lealdade"] },
    desc: { en: "Fixed fire ruled by the Sun: identity made visible. Leo creates and warms — its lesson is shining without needing the mirror of applause.",
            pt: "Fogo fixo regido pelo Sol: identidade tornada visível. Leão cria e aquece — sua lição é brilhar sem precisar do espelho do aplauso." } },
  { sign: "virgo", keywords: { en: ["precision", "service", "discernment"], pt: ["precisão", "serviço", "discernimento"] },
    desc: { en: "Mutable earth ruled by Mercury: refinement in the useful. Virgo perfects the detail — its lesson is accepting the imperfect as alive.",
            pt: "Terra mutável regida por Mercúrio: refinamento no útil. Virgem aperfeiçoa o detalhe — sua lição é aceitar o imperfeito como vivo." } },
  { sign: "libra", keywords: { en: ["balance", "beauty", "the other"], pt: ["equilíbrio", "beleza", "o outro"] },
    desc: { en: "Cardinal air ruled by Venus: the art of the just measure. Libra weighs and harmonizes — its lesson is choosing even when both sides have merit.",
            pt: "Ar cardinal regido por Vênus: a arte da justa medida. Libra pesa e harmoniza — sua lição é escolher mesmo quando os dois lados têm mérito." } },
  { sign: "scorpio", keywords: { en: ["depth", "power", "rebirth"], pt: ["profundidade", "poder", "renascimento"] },
    desc: { en: "Fixed water ruled by Pluto (and Mars): truth under the surface. Scorpio transforms through intensity — its lesson is trust after control.",
            pt: "Água fixa regida por Plutão (e Marte): a verdade sob a superfície. Escorpião transforma pela intensidade — sua lição é confiar depois de controlar." } },
  { sign: "sagittarius", keywords: { en: ["meaning", "expansion", "honesty"], pt: ["sentido", "expansão", "honestidade"] },
    desc: { en: "Mutable fire ruled by Jupiter: the arrow toward the horizon. Sagittarius seeks the larger picture — its lesson is honoring the details of the near.",
            pt: "Fogo mutável regido por Júpiter: a flecha rumo ao horizonte. Sagitário busca o quadro maior — sua lição é honrar os detalhes do perto." } },
  { sign: "capricorn", keywords: { en: ["structure", "ambition", "time"], pt: ["estrutura", "ambição", "tempo"] },
    desc: { en: "Cardinal earth ruled by Saturn: mastery through time. Capricorn climbs by craft and duty — its lesson is letting tenderness in through the armor.",
            pt: "Terra cardinal regida por Saturno: maestria através do tempo. Capricórnio sobe pelo ofício e pelo dever — sua lição é deixar a ternura entrar pela armadura." } },
  { sign: "aquarius", keywords: { en: ["vision", "freedom", "community"], pt: ["visão", "liberdade", "coletivo"] },
    desc: { en: "Fixed air ruled by Uranus (and Saturn): the mind that belongs to the future. Aquarius reforms systems — its lesson is staying human inside the idea.",
            pt: "Ar fixo regido por Urano (e Saturno): a mente que pertence ao futuro. Aquário reforma sistemas — sua lição é permanecer humano dentro da ideia." } },
  { sign: "pisces", keywords: { en: ["empathy", "imagination", "dissolution"], pt: ["empatia", "imaginação", "dissolução"] },
    desc: { en: "Mutable water ruled by Neptune (and Jupiter): the ocean without walls. Pisces feels everything — its lesson is boundaries that let art exist.",
            pt: "Água mutável regida por Netuno (e Júpiter): o oceano sem muros. Peixes sente tudo — sua lição são as fronteiras que deixam a arte existir." } },
];

export const PLANET_ENTRIES: PlanetEntry[] = [
  { planet: "sun", keywords: { en: ["identity", "vitality", "purpose"], pt: ["identidade", "vitalidade", "propósito"] },
    desc: { en: "The center of the chart: who you are becoming. Its sign shows the style of your essential self; its house, the stage where that self must shine.",
            pt: "O centro do mapa: quem você está se tornando. Seu signo mostra o estilo do eu essencial; sua casa, o palco onde esse eu precisa brilhar." } },
  { planet: "moon", keywords: { en: ["emotion", "needs", "instinct"], pt: ["emoção", "necessidades", "instinto"] },
    desc: { en: "Your inner weather and what safety feels like. The Moon's sign describes how you feel and are soothed; its house, where you seek belonging.",
            pt: "Seu clima interno e o que significa segurança. O signo da Lua descreve como você sente e se acalma; a casa, onde você busca pertencer." } },
  { planet: "mercury", keywords: { en: ["mind", "speech", "learning"], pt: ["mente", "fala", "aprendizado"] },
    desc: { en: "How you think, speak and connect ideas. Mercury's condition colors your language, humor and the way you learn.",
            pt: "Como você pensa, fala e conecta ideias. A condição de Mercúrio colore sua linguagem, seu humor e seu jeito de aprender." } },
  { planet: "venus", keywords: { en: ["love", "value", "pleasure"], pt: ["amor", "valor", "prazer"] },
    desc: { en: "What you find beautiful and how you draw it near. Venus shows your way of loving, your taste, and what you consider worth having.",
            pt: "O que você acha belo e como o atrai. Vênus mostra seu jeito de amar, seu gosto e o que você considera digno de ter." } },
  { planet: "mars", keywords: { en: ["desire", "action", "courage"], pt: ["desejo", "ação", "coragem"] },
    desc: { en: "How you pursue, fight and defend. Mars is the engine — its sign is the style of your drive, its house the arena where you spend it.",
            pt: "Como você persegue, luta e defende. Marte é o motor — seu signo é o estilo do impulso, sua casa é a arena onde ele se gasta." } },
  { planet: "jupiter", keywords: { en: ["expansion", "faith", "luck"], pt: ["expansão", "fé", "sorte"] },
    desc: { en: "Where life says yes. Jupiter enlarges what it touches — opportunity, belief and generosity live in its house.",
            pt: "Onde a vida diz sim. Júpiter amplia o que toca — oportunidade, crença e generosidade moram na casa dele." } },
  { planet: "saturn", keywords: { en: ["limits", "mastery", "responsibility"], pt: ["limites", "maestria", "responsabilidade"] },
    desc: { en: "Where life asks for work and proof. Saturn marks the slow curriculum — fear at first, authority in the end.",
            pt: "Onde a vida pede trabalho e prova. Saturno marca o currículo lento — medo no começo, autoridade no fim." } },
  { planet: "uranus", keywords: { en: ["rupture", "freedom", "genius"], pt: ["ruptura", "liberdade", "genialidade"] },
    desc: { en: "The lightning of change. Uranus shows where you refuse the script — sudden turns, invention and independence.",
            pt: "O raio da mudança. Urano mostra onde você recusa o roteiro — viradas súbitas, invenção e independência." } },
  { planet: "neptune", keywords: { en: ["dream", "dissolution", "compassion"], pt: ["sonho", "dissolução", "compaixão"] },
    desc: { en: "The fog and the music. Neptune dissolves borders where it sits — inspiration and illusion share the same door.",
            pt: "A névoa e a música. Netuno dissolve fronteiras onde está — inspiração e ilusão dividem a mesma porta." } },
  { planet: "pluto", keywords: { en: ["power", "shadow", "regeneration"], pt: ["poder", "sombra", "regeneração"] },
    desc: { en: "The slow volcano. Pluto marks where life composts and reboots you — control surrendered becomes power reclaimed.",
            pt: "O vulcão lento. Plutão marca onde a vida composta e reinicia você — controle entregue vira poder retomado." } },
  { planet: "northNode", keywords: { en: ["direction", "growth", "unfamiliar path"], pt: ["direção", "crescimento", "caminho não-familiar"] },
    desc: { en: "Not a planet but a point: the direction of growth. The North Node pulls toward the unfamiliar quality your chart is learning.",
            pt: "Não é um planeta, é um ponto: a direção do crescimento. O Nodo Norte puxa para a qualidade não-familiar que seu mapa está aprendendo." } },
];

export const HOUSE_ENTRIES: HouseEntry[] = [
  { house: 1, title: { en: "Self & Body", pt: "Eu & Corpo" }, keywords: { en: ["appearance", "approach", "vitality"], pt: ["aparência", "postura", "vitalidade"] },
    desc: { en: "The Ascendant's house: the mask, the body, the way you enter rooms. Planets here are visible in everything you do.",
            pt: "A casa do Ascendente: a máscara, o corpo, o jeito de entrar nos lugares. Planetas aqui ficam visíveis em tudo o que você faz." } },
  { house: 2, title: { en: "Resources & Worth", pt: "Recursos & Valor" }, keywords: { en: ["money", "talents", "self-worth"], pt: ["dinheiro", "talentos", "autovalor"] },
    desc: { en: "What you have and what you're worth to yourself: income, possessions, innate talents and the security they buy.",
            pt: "O que você tem e o quanto vale para si: renda, posses, talentos inatos e a segurança que eles compram." } },
  { house: 3, title: { en: "Mind & Neighborhood", pt: "Mente & Vizinhança" }, keywords: { en: ["communication", "siblings", "short trips"], pt: ["comunicação", "irmãos", "trajetos curtos"] },
    desc: { en: "The daily mind: words, messages, siblings, school years and the streets you know by heart.",
            pt: "A mente cotidiana: palavras, mensagens, irmãos, anos de escola e as ruas que você sabe de cor." } },
  { house: 4, title: { en: "Home & Roots", pt: "Lar & Raízes" }, keywords: { en: ["family", "origin", "inner base"], pt: ["família", "origem", "base interna"] },
    desc: { en: "The IC's house: family, ancestry, the private self and the ground you stand on when no one is watching.",
            pt: "A casa do Fundo do Céu: família, ancestralidade, o eu privado e o chão em que você pisa quando ninguém vê." } },
  { house: 5, title: { en: "Creation & Romance", pt: "Criação & Romance" }, keywords: { en: ["art", "play", "children"], pt: ["arte", "jogo", "filhos"] },
    desc: { en: "The heart's wager: creativity, romance, children, play — everything you make because it delights you.",
            pt: "A aposta do coração: criatividade, romance, filhos, jogo — tudo o que você faz porque te encanta." } },
  { house: 6, title: { en: "Work & Health", pt: "Trabalho & Saúde" }, keywords: { en: ["routine", "service", "body care"], pt: ["rotina", "serviço", "cuidado do corpo"] },
    desc: { en: "The craft of the everyday: routines, service, colleagues, and the body's maintenance — health as practice.",
            pt: "O ofício do cotidiano: rotinas, serviço, colegas e a manutenção do corpo — saúde como prática." } },
  { house: 7, title: { en: "Partnership", pt: "Parceria" }, keywords: { en: ["marriage", "contracts", "the mirror"], pt: ["casamento", "contratos", "o espelho"] },
    desc: { en: "The Descendant's house: committed one-to-one bonds — partners, associates, open rivals. What you meet in the other.",
            pt: "A casa do Descendente: vínculos comprometidos um-a-um — pares, sócios, rivais declarados. O que você encontra no outro." } },
  { house: 8, title: { en: "Depth & Shared Assets", pt: "Profundezas & Bens Compartilhados" }, keywords: { en: ["intimacy", "crisis", "inheritance"], pt: ["intimidade", "crise", "herança"] },
    desc: { en: "What is merged and what is transformed: intimacy, other people's money, debts, losses and rebirths.",
            pt: "O que se funde e o que se transforma: intimidade, dinheiro alheio, dívidas, perdas e renascimentos." } },
  { house: 9, title: { en: "Meaning & Horizon", pt: "Sentido & Horizonte" }, keywords: { en: ["philosophy", "travel", "teaching"], pt: ["filosofia", "viagens", "ensino"] },
    desc: { en: "The long journey: higher study, foreign lands, publishing, faith — the search for what it all means.",
            pt: "A longa viagem: estudos superiores, terras estrangeiras, publicação, fé — a busca do que tudo significa." } },
  { house: 10, title: { en: "Vocation & Public Life", pt: "Vocação & Vida Pública" }, keywords: { en: ["career", "reputation", "authority"], pt: ["carreira", "reputação", "autoridade"] },
    desc: { en: "The Midheaven's house: your visible summit — career, reputation, the mark you leave on the world's ledger.",
            pt: "A casa do Meio do Céu: seu cume visível — carreira, reputação, a marca que você deixa no livro do mundo." } },
  { house: 11, title: { en: "Friends & Futures", pt: "Amigos & Futuros" }, keywords: { en: ["community", "networks", "hopes"], pt: ["comunidade", "redes", "esperanças"] },
    desc: { en: "The company you choose: friends, groups, causes — and the future you are building with them.",
            pt: "A companhia que você escolhe: amigos, grupos, causas — e o futuro que você constrói com eles." } },
  { house: 12, title: { en: "The Unseen", pt: "O Invisível" }, keywords: { en: ["unconscious", "retreat", "endings"], pt: ["inconsciente", "retiro", "finais"] },
    desc: { en: "Behind the stage: solitude, dreams, hidden patterns, hospitals and monasteries — where the self dissolves and restores.",
            pt: "Atrás do palco: solitude, sonhos, padrões ocultos, hospitais e mosteiros — onde o eu se dissolve e se restaura." } },
];

export const ASPECT_ENTRIES: AspectEntry[] = [
  { type: "conjunction", angle: 0, orb: 8, nature: "neutral",
    desc: { en: "Two planets fused at the same degree: their agendas merge. Powerful for better or worse — the pair decides.",
            pt: "Dois planetas fundidos no mesmo grau: suas agendas se misturam. Poderosa para o bem ou para o mal — o par decide." } },
  { type: "opposition", angle: 180, orb: 8, nature: "tense",
    desc: { en: "Face to face across the wheel: a tug-of-war that seeks balance. Often lived out through other people.",
            pt: "Frente a frente na roda: um cabo de guerra que busca equilíbrio. Muitas vezes vivida através de outras pessoas." } },
  { type: "trine", angle: 120, orb: 6, nature: "harmonious",
    desc: { en: "Same element, easy flow: talent that feels natural. The risk is laziness — gifts unexercised.",
            pt: "Mesmo elemento, fluxo fácil: talento que parece natural. O risco é a preguiça — dons sem exercício." } },
  { type: "square", angle: 90, orb: 6, nature: "tense",
    desc: { en: "Friction that demands action: two drives at cross purposes. The engine of achievement when worked.",
            pt: "Fricção que exige ação: dois impulsos em rota de colisão. O motor da conquista quando trabalhada." } },
  { type: "sextile", angle: 60, orb: 4, nature: "harmonious",
    desc: { en: "Compatible elements, a door ajar: opportunity that answers when invited. Gentler than the trine.",
            pt: "Elementos compatíveis, porta entreaberta: oportunidade que responde quando convidada. Mais suave que o trígono." } },
  { type: "quincunx", angle: 150, orb: 2, nature: "tense",
    desc: { en: "No shared element or modality: an awkward adjustment. Chronic recalibration rather than open conflict.",
            pt: "Sem elemento nem modalidade em comum: um ajuste desajeitado. Recalibração crônica, mais que conflito aberto." } },
];
