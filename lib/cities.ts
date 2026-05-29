/** Static city list with coordinates — stand-in for OpenCage geocoding until an
 *  API key is configured. utcOffset is the standard (non-DST) offset, sufficient
 *  for the engine's longitude-based fallback. */
export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  utcOffset: number;
}

export const CITIES: City[] = [
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, utcOffset: 0 },
  { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698, utcOffset: 1 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, utcOffset: 1 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, utcOffset: 0 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, utcOffset: 1 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, utcOffset: 1 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, utcOffset: 1 },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.006, utcOffset: -5 },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, utcOffset: -8 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, utcOffset: -3 },
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, utcOffset: -3 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, utcOffset: -3 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, utcOffset: 9 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, utcOffset: 10 },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, utcOffset: 2 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, utcOffset: 5.5 },
];

export function findCity(query: string): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return CITIES.slice(0, 6);
  return CITIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
}

export const cityLabel = (c: City) => `${c.name}, ${c.country}`;
