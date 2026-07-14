export type SpreadId = "single" | "three" | "cross";

export interface SpreadPosition {
  id: string;
  name: { en: string; pt: string };
}

export interface Spread {
  id: SpreadId;
  positions: SpreadPosition[];
}

export const SPREADS: Record<SpreadId, Spread> = {
  single: {
    id: "single",
    positions: [{ id: "heart", name: { en: "The heart of the matter", pt: "O coração da questão" } }],
  },
  three: {
    id: "three",
    positions: [
      { id: "past", name: { en: "Past", pt: "Passado" } },
      { id: "present", name: { en: "Present", pt: "Presente" } },
      { id: "future", name: { en: "Future", pt: "Futuro" } },
    ],
  },
  cross: {
    id: "cross",
    positions: [
      { id: "present", name: { en: "The present", pt: "O presente" } },
      { id: "challenge", name: { en: "The challenge", pt: "O desafio" } },
      { id: "root", name: { en: "The root", pt: "A raiz" } },
      { id: "recent-past", name: { en: "Recent past", pt: "Passado recente" } },
      { id: "crown", name: { en: "The crown — potential", pt: "A coroa — potencial" } },
      { id: "near-future", name: { en: "Near future", pt: "Futuro próximo" } },
      { id: "self", name: { en: "You — your stance", pt: "Você — sua postura" } },
      { id: "environment", name: { en: "The environment", pt: "O ambiente" } },
      { id: "hopes-fears", name: { en: "Hopes & fears", pt: "Esperanças e medos" } },
      { id: "outcome", name: { en: "The outcome", pt: "O desfecho" } },
    ],
  },
};
