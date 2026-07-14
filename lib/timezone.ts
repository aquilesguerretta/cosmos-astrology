/* Historical timezone resolution via the runtime's built-in IANA tz database
   (Intl). Handles DST and past offset changes worldwide with zero deps —
   e.g. São Paulo kept summer time until 2019; a 2004 January birth is UTC-2
   while a September one is UTC-3. */

function wallClockInZone(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) parts[p.type] = p.value;
  return Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
}

/**
 * UTC instant (ms) for a local wall-clock date/time in an IANA zone.
 * Fixed-point iteration: guess UTC, see what wall clock it produces in the
 * zone, correct by the difference. Converges in ≤3 steps.
 */
export function resolveUtcMs(dateISO: string, timeHM: string, timeZone: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = timeHM.split(":").map(Number);
  const wanted = Date.UTC(y, m - 1, d, hh, mm);

  let utc = wanted;
  for (let i = 0; i < 4; i++) {
    const produced = wallClockInZone(utc, timeZone);
    const diff = wanted - produced;
    if (diff === 0) break;
    utc += diff;
  }
  return utc;
}

/** UTC offset (hours, east positive) in effect at that local moment. */
export function offsetForZone(dateISO: string, timeHM: string, timeZone: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = timeHM.split(":").map(Number);
  const wanted = Date.UTC(y, m - 1, d, hh, mm);
  return (wanted - resolveUtcMs(dateISO, timeHM, timeZone)) / 3_600_000;
}

/** True when the runtime knows this IANA zone. */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
