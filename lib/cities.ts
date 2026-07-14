/** Offline city fallback used when the geocoding API is unreachable. Live
 *  worldwide search lives in /api/geocode (Open-Meteo, keyless). */
export interface City {
  name: string;
  region?: string;
  country: string;
  lat: number;
  lng: number;
  /** IANA zone — resolves historical UTC offsets for the birth moment. */
  timeZone: string;
}

export const CITIES: City[] = [
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, timeZone: "Europe/Lisbon" },
  { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698, timeZone: "Europe/Paris" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, timeZone: "Europe/Paris" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timeZone: "Europe/London" },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, timeZone: "Europe/Madrid" },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, timeZone: "Europe/Rome" },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, timeZone: "Europe/Berlin" },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.006, timeZone: "America/New_York" },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, timeZone: "America/Los_Angeles" },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, timeZone: "America/Sao_Paulo" },
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, timeZone: "America/Sao_Paulo" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, timeZone: "America/Argentina/Buenos_Aires" },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, timeZone: "Asia/Tokyo" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timeZone: "Australia/Sydney" },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, timeZone: "Africa/Cairo" },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, timeZone: "Asia/Kolkata" },
];

export function findCity(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return CITIES.slice(0, 6);
  return CITIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
}

export const cityLabel = (c: Pick<City, "name" | "region" | "country">) =>
  [c.name, c.region, c.country].filter(Boolean).join(", ");
