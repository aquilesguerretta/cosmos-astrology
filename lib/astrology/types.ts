/* Canonical astrology domain types. Mirrors the string-union types used by the
   UI primitives (components/ui) so values are interchangeable. */

export type ZodiacSign =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type Planet =
  | "sun" | "moon" | "mercury" | "venus" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"
  | "northNode" | "chiron" | "lilith" | "fortune" | "vertex";

export type HouseSystem = "placidus" | "whole_sign" | "equal" | "koch";

export type AspectType =
  | "conjunction" | "opposition" | "trine" | "square" | "sextile" | "quincunx";

export interface PlanetPosition {
  planet: Planet;
  /** Absolute ecliptic longitude, 0–360°. */
  longitude: number;
  sign: ZodiacSign;
  /** Whole degrees within the sign, 0–29. */
  degree: number;
  /** Arcminutes within the degree, 0–59. */
  minutes: number;
  /** House number 1–12. */
  house: number;
  isRetrograde: boolean;
  /** Degrees per day (negative = retrograde). */
  speed: number;
}

export interface HouseCusp {
  house: number; // 1–12
  /** Absolute ecliptic longitude, 0–360°. */
  longitude: number;
  sign: ZodiacSign;
  /** Degrees within the sign, 0–29.99 (fractional). */
  degree: number;
}

export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  /** Deviation from exact aspect, in degrees. */
  orb: number;
  isApplying: boolean;
  isHarmonious: boolean;
}

export interface ChartAngles {
  asc: number; // Ascendant (absolute longitude)
  mc: number; // Midheaven
  dsc: number; // Descendant
  ic: number; // Imum Coeli
}

export interface ElementBalance { fire: number; earth: number; air: number; water: number; }
export interface ModalityBalance { cardinal: number; fixed: number; mutable: number; }

export interface ChartData {
  planets: PlanetPosition[];
  houses: HouseCusp[]; // 12 cusps
  aspects: Aspect[];
  angles: ChartAngles;
  elements: ElementBalance;
  modalities: ModalityBalance;
}

export interface NatalInput {
  date: string; // "YYYY-MM-DD" (local civil date)
  time: string; // "HH:MM" (local civil time)
  lat: number; // degrees, north positive
  lng: number; // degrees, east positive
  houseSystem?: HouseSystem; // default "placidus"
  /** UTC offset in hours of the birth place (e.g. -3 for Rio). Defaults to round(lng/15). */
  utcOffset?: number;
}

export type ElementName = keyof ElementBalance;
export type ModalityName = keyof ModalityBalance;

export const SIGN_ORDER: ZodiacSign[] = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

export const SIGN_ELEMENT: Record<ZodiacSign, ElementName> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

export const SIGN_MODALITY: Record<ZodiacSign, ModalityName> = {
  aries: "cardinal", cancer: "cardinal", libra: "cardinal", capricorn: "cardinal",
  taurus: "fixed", leo: "fixed", scorpio: "fixed", aquarius: "fixed",
  gemini: "mutable", virgo: "mutable", sagittarius: "mutable", pisces: "mutable",
};
