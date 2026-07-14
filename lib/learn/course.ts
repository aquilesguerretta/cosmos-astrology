/* The Cosmos Academy — a bilingual course on the methodology behind the app:
   astrology from first principles to full synthesis, transits, synastry,
   and the tarot from structure to spread. */

interface L { en: string; pt: string }

export interface Quiz {
  question: L;
  options: L[];
  answer: number; // index into options
}

export interface Lesson {
  id: string;
  title: L;
  paragraphs: L[];
  takeaways: L[];
  quiz: Quiz;
}

export interface Module {
  id: string;
  title: L;
  blurb: L;
  lessons: Lesson[];
}

export const COURSE: Module[] = [
  {
    id: "foundations",
    title: { en: "Foundations of Astrology", pt: "Fundamentos da Astrologia" },
    blurb: { en: "What a chart is and the grammar behind the twelve signs.", pt: "O que é um mapa e a gramática por trás dos doze signos." },
    lessons: [
      {
        id: "what-is-a-chart",
        title: { en: "What a birth chart actually is", pt: "O que é, de fato, um mapa natal" },
        paragraphs: [
          { en: "A birth chart is a photograph of the sky taken from the exact place and moment you were born. It is not a prophecy: it is a diagram — the positions of the Sun, Moon and planets projected onto a circle of 360 degrees, seen from Earth.",
            pt: "Um mapa natal é uma fotografia do céu tirada do lugar e do momento exatos em que você nasceu. Não é uma profecia: é um diagrama — as posições do Sol, da Lua e dos planetas projetadas num círculo de 360 graus, vistas da Terra." },
          { en: "Western astrology uses the tropical zodiac: the circle starts at 0° Aries, the point of the March equinox, and divides the year of the Sun into twelve equal segments of 30°. That is why your 'sign' is simply where the Sun stood along that circle when you were born.",
            pt: "A astrologia ocidental usa o zodíaco tropical: o círculo começa em 0° de Áries, o ponto do equinócio de março, e divide o ano do Sol em doze segmentos iguais de 30°. Por isso o seu 'signo' é simplesmente onde o Sol estava nesse círculo quando você nasceu." },
          { en: "Time and place matter because of the horizon. The Ascendant — the degree rising in the east at your birth — moves through all twelve signs every 24 hours. Two people born the same day in different cities or hours get different houses, and therefore different charts.",
            pt: "Hora e lugar importam por causa do horizonte. O Ascendente — o grau que nascia no leste no seu nascimento — percorre os doze signos a cada 24 horas. Duas pessoas nascidas no mesmo dia em cidades ou horários diferentes têm casas diferentes e, portanto, mapas diferentes." },
        ],
        takeaways: [
          { en: "A chart = sky snapshot from a time and place.", pt: "Mapa = retrato do céu de um momento e lugar." },
          { en: "The tropical zodiac starts at the March equinox (0° Aries).", pt: "O zodíaco tropical começa no equinócio de março (0° de Áries)." },
          { en: "Birth time changes the Ascendant and houses — precision matters.", pt: "A hora de nascimento muda Ascendente e casas — precisão importa." },
        ],
        quiz: {
          question: { en: "Why does birth time matter so much?", pt: "Por que a hora de nascimento importa tanto?" },
          options: [
            { en: "It changes the Sun sign", pt: "Ela muda o signo solar" },
            { en: "It sets the Ascendant and the houses", pt: "Ela define o Ascendente e as casas" },
            { en: "It changes the planets' signs", pt: "Ela muda os signos dos planetas" },
            { en: "It doesn't — only the date matters", pt: "Não importa — só a data conta" },
          ],
          answer: 1,
        },
      },
      {
        id: "elements-modalities",
        title: { en: "Elements & modalities — the 4×3 grammar", pt: "Elementos & modalidades — a gramática 4×3" },
        paragraphs: [
          { en: "The twelve signs are not twelve arbitrary personalities: they are the crossing of four elements with three modalities. Fire (impulse), Earth (matter), Air (idea) and Water (feeling) describe WHAT kind of energy; Cardinal (starts), Fixed (sustains) and Mutable (adapts) describe HOW it moves.",
            pt: "Os doze signos não são doze personalidades arbitrárias: são o cruzamento de quatro elementos com três modalidades. Fogo (impulso), Terra (matéria), Ar (ideia) e Água (sentimento) dizem QUE tipo de energia; Cardinal (inicia), Fixo (sustenta) e Mutável (adapta) dizem COMO ela se move." },
          { en: "Cross them and the twelve appear by necessity: Aries is cardinal fire (the spark that starts), Taurus fixed earth (matter that endures), Gemini mutable air (the idea that circulates) — and so on around the wheel. Memorize the grid, not the list.",
            pt: "Cruze-os e os doze aparecem por necessidade: Áries é fogo cardinal (a faísca que inicia), Touro terra fixa (matéria que dura), Gêmeos ar mutável (a ideia que circula) — e assim por diante. Memorize a grade, não a lista." },
          { en: "In practice, count the elements and modalities in a chart before reading anything else. A chart with five planets in water feels different from one with five in air — that balance is the reading's first sentence.",
            pt: "Na prática, conte os elementos e modalidades de um mapa antes de ler qualquer outra coisa. Um mapa com cinco planetas em água é diferente de um com cinco em ar — esse balanço é a primeira frase da leitura." },
        ],
        takeaways: [
          { en: "12 signs = 4 elements × 3 modalities.", pt: "12 signos = 4 elementos × 3 modalidades." },
          { en: "Element = kind of energy; modality = how it moves.", pt: "Elemento = tipo de energia; modalidade = como ela se move." },
          { en: "Element/modality balance is step one of any reading.", pt: "O balanço de elementos/modalidades é o passo um de qualquer leitura." },
        ],
        quiz: {
          question: { en: "Taurus is…", pt: "Touro é…" },
          options: [
            { en: "Cardinal earth", pt: "Terra cardinal" },
            { en: "Fixed water", pt: "Água fixa" },
            { en: "Fixed earth", pt: "Terra fixa" },
            { en: "Mutable earth", pt: "Terra mutável" },
          ],
          answer: 2,
        },
      },
    ],
  },
  {
    id: "planets",
    title: { en: "The Planets", pt: "Os Planetas" },
    blurb: { en: "From the luminaries to the slow outer gods.", pt: "Dos luminares aos lentos deuses exteriores." },
    lessons: [
      {
        id: "planet-families",
        title: { en: "Luminaries, personal, social, transpersonal", pt: "Luminares, pessoais, sociais, transpessoais" },
        paragraphs: [
          { en: "Read planets in families. The luminaries — Sun (identity) and Moon (needs) — are the core of the person. The personal planets — Mercury (mind), Venus (love and value), Mars (drive) — describe how that core thinks, bonds and acts.",
            pt: "Leia os planetas em famílias. Os luminares — Sol (identidade) e Lua (necessidades) — são o núcleo da pessoa. Os pessoais — Mercúrio (mente), Vênus (amor e valor), Marte (impulso) — descrevem como esse núcleo pensa, se vincula e age." },
          { en: "The social planets — Jupiter (expansion) and Saturn (structure) — spend years in a sign and describe how a person meets society: where they grow with ease and where life demands proof. They already blend the personal with the generational.",
            pt: "Os sociais — Júpiter (expansão) e Saturno (estrutura) — passam anos num signo e descrevem o encontro com a sociedade: onde se cresce com facilidade e onde a vida exige prova. Já misturam o pessoal com o geracional." },
          { en: "Uranus, Neptune and Pluto move so slowly their signs mark generations; what personalizes them is the HOUSE they occupy and the aspects they make. An outer planet on an angle or touching a luminary becomes a life theme.",
            pt: "Urano, Netuno e Plutão movem-se tão devagar que seus signos marcam gerações; o que os personaliza é a CASA que ocupam e os aspectos que fazem. Um planeta exterior num ângulo ou tocando um luminar vira tema de vida." },
        ],
        takeaways: [
          { en: "Sun/Moon = core; Mercury/Venus/Mars = how it operates.", pt: "Sol/Lua = núcleo; Mercúrio/Vênus/Marte = como opera." },
          { en: "Jupiter/Saturn = growth and structure in society.", pt: "Júpiter/Saturno = crescimento e estrutura na sociedade." },
          { en: "Outer planets personalize through house and aspects.", pt: "Exteriores se personalizam pela casa e pelos aspectos." },
        ],
        quiz: {
          question: { en: "What personalizes Uranus, Neptune and Pluto in a chart?", pt: "O que personaliza Urano, Netuno e Plutão num mapa?" },
          options: [
            { en: "Their sign", pt: "O signo deles" },
            { en: "Their house and aspects", pt: "A casa e os aspectos deles" },
            { en: "Their speed", pt: "A velocidade deles" },
            { en: "Nothing — they are generational only", pt: "Nada — são apenas geracionais" },
          ],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "houses",
    title: { en: "The Houses", pt: "As Casas" },
    blurb: { en: "The twelve stages where the planets act.", pt: "Os doze palcos onde os planetas atuam." },
    lessons: [
      {
        id: "twelve-houses",
        title: { en: "The twelve stages & the four angles", pt: "Os doze palcos & os quatro ângulos" },
        paragraphs: [
          { en: "If signs are HOW a planet behaves, houses are WHERE it happens: body and persona (1st), resources (2nd), daily mind (3rd), home (4th), creation (5th), work and health (6th), partnership (7th), shared depths (8th), meaning (9th), vocation (10th), community (11th), the unseen (12th).",
            pt: "Se os signos são o COMO um planeta se comporta, as casas são o ONDE acontece: corpo e persona (1ª), recursos (2ª), mente cotidiana (3ª), lar (4ª), criação (5ª), trabalho e saúde (6ª), parceria (7ª), profundezas compartilhadas (8ª), sentido (9ª), vocação (10ª), coletivo (11ª), o invisível (12ª)." },
          { en: "Four cusps are special — the angles. The Ascendant (1st) is the mask and the body; the Descendant (7th), the significant other; the Midheaven (10th), the public summit; the IC (4th), the private root. Planets touching angles speak loudest in a life.",
            pt: "Quatro cúspides são especiais — os ângulos. O Ascendente (1ª) é a máscara e o corpo; o Descendente (7ª), o outro significativo; o Meio do Céu (10ª), o cume público; o Fundo do Céu (4ª), a raiz privada. Planetas nos ângulos falam mais alto na vida." },
          { en: "House systems differ in how they cut the intermediate cusps. Placidus (our default) divides by time of rising and needs an accurate birth hour; Whole Sign gives each sign a whole house and survives uncertain hours and polar latitudes. Knowing both is method, not dogma.",
            pt: "Sistemas de casas diferem em como cortam as cúspides intermediárias. Placidus (nosso padrão) divide pelo tempo de ascensão e exige hora precisa; Signos Inteiros dá a cada signo uma casa inteira e sobrevive a horas incertas e latitudes polares. Conhecer os dois é método, não dogma." },
        ],
        takeaways: [
          { en: "Sign = how; house = where.", pt: "Signo = como; casa = onde." },
          { en: "Angular planets (ASC/DSC/MC/IC) dominate a chart.", pt: "Planetas angulares (ASC/DSC/MC/FC) dominam o mapa." },
          { en: "Placidus needs a precise hour; Whole Sign is the robust fallback.", pt: "Placidus exige hora precisa; Signos Inteiros é o plano B robusto." },
        ],
        quiz: {
          question: { en: "Which house cusp is the Midheaven (MC)?", pt: "Qual cúspide é o Meio do Céu (MC)?" },
          options: [
            { en: "1st", pt: "1ª" },
            { en: "4th", pt: "4ª" },
            { en: "7th", pt: "7ª" },
            { en: "10th", pt: "10ª" },
          ],
          answer: 3,
        },
      },
    ],
  },
  {
    id: "aspects",
    title: { en: "The Aspects", pt: "Os Aspectos" },
    blurb: { en: "The angles at which planets converse.", pt: "Os ângulos em que os planetas conversam." },
    lessons: [
      {
        id: "major-aspects",
        title: { en: "The five majors, orbs, applying & separating", pt: "Os cinco maiores, orbes, aplicativo & separativo" },
        paragraphs: [
          { en: "Aspects are angular distances between planets: conjunction (0°, fusion), sextile (60°, invitation), square (90°, productive friction), trine (120°, natural flow) and opposition (180°, tug-of-war). The quincunx (150°) is a minor of chronic adjustment.",
            pt: "Aspectos são distâncias angulares entre planetas: conjunção (0°, fusão), sextil (60°, convite), quadratura (90°, fricção produtiva), trígono (120°, fluxo natural) e oposição (180°, cabo de guerra). O quincúncio (150°) é um menor, de ajuste crônico." },
          { en: "The orb is the tolerance: we allow ±8° for conjunction and opposition, ±6° for trine and square, ±4° for sextile, ±2° for quincunx. The tighter the orb, the louder the aspect — a 0.5° square outranks a 5° trine in any synthesis.",
            pt: "O orbe é a tolerância: usamos ±8° para conjunção e oposição, ±6° para trígono e quadratura, ±4° para sextil, ±2° para quincúncio. Quanto menor o orbe, mais alto fala o aspecto — uma quadratura de 0,5° vale mais que um trígono de 5° em qualquer síntese." },
          { en: "An aspect is applying when the faster planet is still approaching exactness (the theme is building), and separating when it has passed (the theme is integrating). In natal work it refines nuance; in horary and electional astrology it is decisive.",
            pt: "Um aspecto é aplicativo quando o planeta mais rápido ainda se aproxima da exatidão (o tema está se formando), e separativo quando já passou (o tema está se integrando). No natal refina a nuance; na horária e na eletiva é decisivo." },
        ],
        takeaways: [
          { en: "Five majors: 0°, 60°, 90°, 120°, 180°.", pt: "Cinco maiores: 0°, 60°, 90°, 120°, 180°." },
          { en: "Tight orb > wide orb, always.", pt: "Orbe apertado > orbe largo, sempre." },
          { en: "Applying = building; separating = integrating.", pt: "Aplicativo = formando; separativo = integrando." },
        ],
        quiz: {
          question: { en: "Which aspect is 90° apart?", pt: "Qual aspecto tem 90° de distância?" },
          options: [
            { en: "Trine", pt: "Trígono" },
            { en: "Square", pt: "Quadratura" },
            { en: "Sextile", pt: "Sextil" },
            { en: "Opposition", pt: "Oposição" },
          ],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "synthesis",
    title: { en: "Chart Synthesis — the Method", pt: "Síntese do Mapa — o Método" },
    blurb: { en: "A step-by-step method to read any chart.", pt: "Um método passo a passo para ler qualquer mapa." },
    lessons: [
      {
        id: "reading-method",
        title: { en: "Reading a chart in six steps", pt: "Lendo um mapa em seis passos" },
        paragraphs: [
          { en: "Step 1 — the Big Three: Sun (who is becoming), Moon (what it needs), Ascendant (how it arrives). Say one sentence for each before touching anything else. Step 2 — count elements and modalities: what is abundant, what is missing.",
            pt: "Passo 1 — o Grande Trio: Sol (quem está se tornando), Lua (do que precisa), Ascendente (como chega). Diga uma frase para cada antes de tocar em qualquer outra coisa. Passo 2 — conte elementos e modalidades: o que abunda, o que falta." },
          { en: "Step 3 — angular planets: anything within a few degrees of ASC, MC, DSC or IC gets promoted to headline. Step 4 — the tightest three aspects in the chart: these are the plot. Step 5 — the houses of the Sun, Moon and chart ruler (the Ascendant's ruler): the life's main stages.",
            pt: "Passo 3 — planetas angulares: qualquer coisa a poucos graus do ASC, MC, DSC ou FC vira manchete. Passo 4 — os três aspectos mais apertados do mapa: eles são o enredo. Passo 5 — as casas do Sol, da Lua e do regente do mapa (o regente do Ascendente): os palcos principais da vida." },
          { en: "Step 6 — synthesize: one paragraph that names the core tension and the core gift, in plain language. If your reading has no tension, you flattered instead of reading; if it has no gift, you frightened instead of reading. Both are failures of method.",
            pt: "Passo 6 — sintetize: um parágrafo que nomeia a tensão central e o dom central, em linguagem simples. Se a sua leitura não tem tensão, você elogiou em vez de ler; se não tem dom, você assustou em vez de ler. Ambos são falhas de método." },
        ],
        takeaways: [
          { en: "Big Three → balance → angles → tight aspects → key houses → synthesis.", pt: "Grande Trio → balanço → ângulos → aspectos apertados → casas-chave → síntese." },
          { en: "Promote angular planets and tight orbs.", pt: "Priorize planetas angulares e orbes apertados." },
          { en: "A good synthesis names one tension and one gift.", pt: "Uma boa síntese nomeia uma tensão e um dom." },
        ],
        quiz: {
          question: { en: "What is the 'chart ruler'?", pt: "O que é o 'regente do mapa'?" },
          options: [
            { en: "The Sun", pt: "O Sol" },
            { en: "The planet ruling the Ascendant's sign", pt: "O planeta que rege o signo do Ascendente" },
            { en: "The biggest planet", pt: "O maior planeta" },
            { en: "The Midheaven", pt: "O Meio do Céu" },
          ],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "transits",
    title: { en: "Transits & Timing", pt: "Trânsitos & Tempo" },
    blurb: { en: "Reading today's sky against your chart.", pt: "Lendo o céu de hoje contra o seu mapa." },
    lessons: [
      {
        id: "reading-transits",
        title: { en: "Slow planets knock loudest", pt: "Planetas lentos batem mais forte" },
        paragraphs: [
          { en: "A transit is today's sky touching your natal chart: a moving planet entering one of your houses or aspecting one of your natal points. The Moon transits your whole chart every month — noise. Saturn takes 29 years — signal.",
            pt: "Trânsito é o céu de hoje tocando o seu mapa natal: um planeta em movimento entrando numa das suas casas ou aspectando um dos seus pontos natais. A Lua transita o mapa inteiro todo mês — ruído. Saturno leva 29 anos — sinal." },
          { en: "Method: track only the slow planets (Jupiter outward) by house, and any planet when it exactly aspects your Sun, Moon, Ascendant or chart ruler. A transit 'activates' the natal promise; it rarely invents something the chart doesn't contain.",
            pt: "Método: acompanhe só os lentos (de Júpiter para fora) por casa, e qualquer planeta quando aspecta com exatidão seu Sol, Lua, Ascendente ou regente do mapa. O trânsito 'ativa' a promessa natal; raramente inventa algo que o mapa não contenha." },
          { en: "Retrogrades are apparent backward motion — review periods, not curses. Mercury retrograde: re-read, re-negotiate, re-pair; it is the sky's editing pass, three times a year.",
            pt: "Retrógrados são movimento aparente para trás — períodos de revisão, não maldições. Mercúrio retrógrado: reler, renegociar, reparar; é a revisão de texto do céu, três vezes por ano." },
        ],
        takeaways: [
          { en: "Slow transits by house = life chapters.", pt: "Trânsitos lentos por casa = capítulos de vida." },
          { en: "Exact hits to Sun/Moon/ASC matter most.", pt: "Toques exatos em Sol/Lua/ASC importam mais." },
          { en: "Retrograde = review, not disaster.", pt: "Retrógrado = revisão, não desastre." },
        ],
        quiz: {
          question: { en: "Why do slow planets matter more in transits?", pt: "Por que os planetas lentos importam mais nos trânsitos?" },
          options: [
            { en: "They are bigger", pt: "São maiores" },
            { en: "They stay in one area for years — themes, not moods", pt: "Ficam anos numa área — temas, não humores" },
            { en: "They are farther away", pt: "Estão mais longe" },
            { en: "They are retrograde more often", pt: "Ficam retrógrados com mais frequência" },
          ],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "synastry",
    title: { en: "Synastry — the Method", pt: "Sinastria — o Método" },
    blurb: { en: "How two charts converse.", pt: "Como dois mapas conversam." },
    lessons: [
      {
        id: "synastry-method",
        title: { en: "Weighing two charts honestly", pt: "Pesando dois mapas com honestidade" },
        paragraphs: [
          { en: "Synastry lays one chart over another and reads the inter-aspects: your Moon to their Sun, your Venus to their Mars. Contacts between luminaries (Sun/Moon) weigh most — they bind identities and needs; Venus–Mars contacts describe attraction; Saturn contacts, glue and weight.",
            pt: "A sinastria sobrepõe um mapa ao outro e lê os inter-aspectos: sua Lua com o Sol da pessoa, sua Vênus com o Marte dela. Contatos entre luminares (Sol/Lua) pesam mais — amarram identidades e necessidades; Vênus–Marte descreve a atração; contatos de Saturno, a cola e o peso." },
          { en: "Read both directions: how their planets land in your houses (where they light you up) and yours in theirs. A relationship with only trines is comfortable and can be inert; squares supply the heat that makes two people grow — the point is proportion, not perfection.",
            pt: "Leia nas duas direções: como os planetas da pessoa caem nas suas casas (onde ela te acende) e os seus nas dela. Uma relação só de trígonos é confortável e pode ser inerte; quadraturas dão o calor que faz duas pessoas crescerem — a questão é proporção, não perfeição." },
          { en: "Our resonance score follows this method: Sun–Sun and Moon–Moon contacts weigh 20% each, Venus–Mars 15%, Moon–Sun 15%, Ascendant contacts 10%, and the overall harmony of every inter-aspect the remaining 20%.",
            pt: "Nosso índice de ressonância segue esse método: contatos Sol–Sol e Lua–Lua pesam 20% cada, Vênus–Marte 15%, Lua–Sol 15%, contatos de Ascendente 10%, e a harmonia geral de todos os inter-aspectos os 20% restantes." },
        ],
        takeaways: [
          { en: "Luminaries' contacts carry the most weight.", pt: "Contatos dos luminares pesam mais." },
          { en: "Squares are heat, not doom — proportion is the point.", pt: "Quadraturas são calor, não condenação — proporção é o ponto." },
          { en: "Read both directions: their planets in your houses too.", pt: "Leia nas duas direções: os planetas do outro nas suas casas também." },
        ],
        quiz: {
          question: { en: "Which inter-aspects weigh most in compatibility?", pt: "Quais inter-aspectos pesam mais na compatibilidade?" },
          options: [
            { en: "Mars–Pluto", pt: "Marte–Plutão" },
            { en: "Sun and Moon contacts", pt: "Contatos de Sol e Lua" },
            { en: "Mercury–Mercury", pt: "Mercúrio–Mercúrio" },
            { en: "Jupiter–Saturn", pt: "Júpiter–Saturno" },
          ],
          answer: 1,
        },
      },
    ],
  },
  {
    id: "tarot-structure",
    title: { en: "Tarot — the Architecture", pt: "Tarô — a Arquitetura" },
    blurb: { en: "78 cards, one coherent system.", pt: "78 cartas, um sistema coerente." },
    lessons: [
      {
        id: "deck-structure",
        title: { en: "Majors, minors, suits and courts", pt: "Maiores, menores, naipes e corte" },
        paragraphs: [
          { en: "The deck is 78 cards in two registers. The 22 Major Arcana (0 The Fool to XXI The World) are the soul's chapters — archetypal forces like Death, the Tower, the Star. When majors dominate a spread, the matter is larger than daily management.",
            pt: "O baralho tem 78 cartas em dois registros. Os 22 Arcanos Maiores (0 O Louco a XXI O Mundo) são os capítulos da alma — forças arquetípicas como a Morte, a Torre, a Estrela. Quando os maiores dominam uma tiragem, o assunto é maior que a gestão do dia a dia." },
          { en: "The 56 Minor Arcana are daily life in four suits, each tied to an element: Wands/fire (will and work), Cups/water (feeling and bonds), Swords/air (mind and conflict), Pentacles/earth (body and money).",
            pt: "Os 56 Arcanos Menores são a vida cotidiana em quatro naipes, cada um ligado a um elemento: Paus/fogo (vontade e trabalho), Copas/água (sentir e vínculos), Espadas/ar (mente e conflito), Ouros/terra (corpo e dinheiro)." },
          { en: "Each suit runs Ace to Ten plus four court cards. The courts are people or postures: the Page studies, the Knight pursues, the Queen masters inward, the King masters outward — always in the suit's domain.",
            pt: "Cada naipe vai do Ás ao Dez, mais quatro cartas da corte. A corte são pessoas ou posturas: o Valete estuda, o Cavaleiro persegue, a Rainha domina para dentro, o Rei domina para fora — sempre no domínio do naipe." },
        ],
        takeaways: [
          { en: "22 majors = archetypes; 56 minors = daily life.", pt: "22 maiores = arquétipos; 56 menores = vida cotidiana." },
          { en: "Suits map to the four elements.", pt: "Naipes correspondem aos quatro elementos." },
          { en: "Courts: Page studies, Knight pursues, Queen/King master.", pt: "Corte: Valete estuda, Cavaleiro persegue, Rainha/Rei dominam." },
        ],
        quiz: {
          question: { en: "Cups correspond to which element?", pt: "Copas correspondem a qual elemento?" },
          options: [
            { en: "Fire", pt: "Fogo" },
            { en: "Air", pt: "Ar" },
            { en: "Water", pt: "Água" },
            { en: "Earth", pt: "Terra" },
          ],
          answer: 2,
        },
      },
      {
        id: "number-method",
        title: { en: "The number method — derive any minor", pt: "O método dos números — derive qualquer menor" },
        paragraphs: [
          { en: "You do not memorize 56 minor cards; you derive them. Each number carries a theme: Ace a seed, Two a choice, Three growth, Four stability, Five friction, Six harmony restored, Seven assessment, Eight skilled effort, Nine fruition, Ten completion.",
            pt: "Você não decora as 56 cartas menores; você as deriva. Cada número carrega um tema: Ás semente, Dois escolha, Três crescimento, Quatro estabilidade, Cinco fricção, Seis harmonia restaurada, Sete avaliação, Oito esforço hábil, Nove fruição, Dez conclusão." },
          { en: "Cross the number with the suit's domain and the card appears: Five (friction) of Pentacles (money, body) = material hardship; Nine (fruition) of Cups (feeling) = the wish fulfilled. This is exactly how our deck's minor meanings are generated.",
            pt: "Cruze o número com o domínio do naipe e a carta aparece: Cinco (fricção) de Ouros (dinheiro, corpo) = dificuldade material; Nove (fruição) de Copas (sentir) = o desejo realizado. É exatamente assim que os significados dos menores deste app são gerados." },
          { en: "Reversals: read them as the theme blocked, delayed or turned inward — not as automatic catastrophe. A reversed Ace of Wands is not 'no fire'; it is fire without an outlet yet.",
            pt: "Invertidas: leia como o tema bloqueado, atrasado ou voltado para dentro — não como catástrofe automática. Um Ás de Paus invertido não é 'sem fogo'; é fogo ainda sem saída." },
        ],
        takeaways: [
          { en: "Minor card = number theme × suit domain.", pt: "Carta menor = tema do número × domínio do naipe." },
          { en: "Learn 10 themes + 4 domains, gain 40 cards.", pt: "Aprenda 10 temas + 4 domínios, ganhe 40 cartas." },
          { en: "Reversal = blocked/delayed/inverted, not doom.", pt: "Invertida = bloqueado/atrasado/para dentro, não desgraça." },
        ],
        quiz: {
          question: { en: "By the method, the Five of Cups means…", pt: "Pelo método, o Cinco de Copas significa…" },
          options: [
            { en: "Friction in the domain of feeling — a loss that teaches", pt: "Fricção no domínio do sentir — uma perda que ensina" },
            { en: "Completion of a project", pt: "Conclusão de um projeto" },
            { en: "A new financial seed", pt: "Uma nova semente financeira" },
            { en: "Skilled effort at work", pt: "Esforço hábil no trabalho" },
          ],
          answer: 0,
        },
      },
    ],
  },
  {
    id: "tarot-practice",
    title: { en: "Tarot — Practice & Ethics", pt: "Tarô — Prática & Ética" },
    blurb: { en: "Questions, spreads, honesty.", pt: "Perguntas, tiragens, honestidade." },
    lessons: [
      {
        id: "asking-spreads",
        title: { en: "Crafting the question & choosing the spread", pt: "Formulando a pergunta & escolhendo a tiragem" },
        paragraphs: [
          { en: "The reading is only as good as the question. Prefer open questions ('what do I need to see about X?') over binary ones ('will X happen?') — cards describe currents and choices, not fixed verdicts. Write the question down before shuffling; it disciplines the reading.",
            pt: "A leitura vale o que vale a pergunta. Prefira perguntas abertas ('o que preciso ver sobre X?') a binárias ('X vai acontecer?') — as cartas descrevem correntes e escolhas, não vereditos fixos. Escreva a pergunta antes de embaralhar; isso disciplina a leitura." },
          { en: "Match the spread to the question's size: one card for a daily focus or a direct answer; three (past–present–future) for the arc of a situation; the Celtic Cross when you need the whole architecture — root, crown, environment, hopes and outcome.",
            pt: "Ajuste a tiragem ao tamanho da pergunta: uma carta para o foco do dia ou uma resposta direta; três (passado–presente–futuro) para o arco de uma situação; a Cruz Celta quando você precisa da arquitetura inteira — raiz, coroa, ambiente, esperanças e desfecho." },
          { en: "Read positions first, cards second: the same Tower means one thing as 'the root' and another as 'the outcome'. Then read the conversation — repeated suits, a majority of majors, numbers that echo. The spread is a sentence, not a list.",
            pt: "Leia as posições primeiro, as cartas depois: a mesma Torre significa uma coisa como 'raiz' e outra como 'desfecho'. Depois leia a conversa — naipes repetidos, maioria de maiores, números que ecoam. A tiragem é uma frase, não uma lista." },
        ],
        takeaways: [
          { en: "Open questions beat yes/no questions.", pt: "Perguntas abertas vencem perguntas de sim/não." },
          { en: "Spread size follows question size.", pt: "O tamanho da tiragem segue o tamanho da pergunta." },
          { en: "Position first, card second, conversation third.", pt: "Posição primeiro, carta depois, conversa por fim." },
        ],
        quiz: {
          question: { en: "What should you read first in a spread?", pt: "O que ler primeiro numa tiragem?" },
          options: [
            { en: "The prettiest card", pt: "A carta mais bonita" },
            { en: "The position each card fell in", pt: "A posição em que cada carta caiu" },
            { en: "Only the majors", pt: "Só os maiores" },
            { en: "The last card", pt: "A última carta" },
          ],
          answer: 1,
        },
      },
      {
        id: "honest-reading",
        title: { en: "Reading with honesty — and without fatalism", pt: "Lendo com honestidade — e sem fatalismo" },
        paragraphs: [
          { en: "An honest reading names the hard cards. Death, the Tower, the Ten of Swords — softening them into vague positivity betrays the querent. Say what the card shows: an ending, a collapse of the false, a rock bottom that is also a floor.",
            pt: "Uma leitura honesta nomeia as cartas difíceis. A Morte, a Torre, o Dez de Espadas — suavizá-las em positividade vaga trai o consulente. Diga o que a carta mostra: um fim, a queda do falso, um fundo do poço que também é chão." },
          { en: "Honesty is not fatalism. Cards show currents, not sentences; the person always keeps agency. The frank reading ends with what can be DONE: what to release, what to confront, what to protect. Truth plus a handle — that is the craft.",
            pt: "Honestidade não é fatalismo. As cartas mostram correntes, não sentenças; a pessoa sempre mantém o leme. A leitura franca termina com o que pode ser FEITO: o que soltar, o que enfrentar, o que proteger. Verdade com alça — esse é o ofício." },
          { en: "Ethics of the table: read only what was asked, don't diagnose health or predict death, don't read third parties who didn't consent, and know when to say 'this needs a professional, not a deck'. Directness and care are not opposites.",
            pt: "Ética da mesa: leia só o que foi perguntado, não diagnostique saúde nem preveja morte, não leia terceiros que não consentiram, e saiba dizer 'isso pede um profissional, não um baralho'. Franqueza e cuidado não são opostos." },
        ],
        takeaways: [
          { en: "Name the hard cards plainly.", pt: "Nomeie as cartas difíceis sem rodeio." },
          { en: "Currents, not sentences — agency stays with the querent.", pt: "Correntes, não sentenças — o leme fica com o consulente." },
          { en: "End every reading with something actionable.", pt: "Termine toda leitura com algo acionável." },
        ],
        quiz: {
          question: { en: "An honest reading of the Tower should…", pt: "Uma leitura honesta da Torre deve…" },
          options: [
            { en: "Skip it and draw another card", pt: "Pular e tirar outra carta" },
            { en: "Say everything will be fine", pt: "Dizer que tudo ficará bem" },
            { en: "Name the collapse and point to what can be done", pt: "Nomear a queda e apontar o que pode ser feito" },
            { en: "Predict the exact date of disaster", pt: "Prever a data exata do desastre" },
          ],
          answer: 2,
        },
      },
    ],
  },
];

export const TOTAL_LESSONS = COURSE.reduce((s, m) => s + m.lessons.length, 0);
