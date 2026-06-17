import { SALON_TZ } from "@/lib/booking-config";

// Vraća offset (u milisekundama) date-a u datoj vremenskoj zoni u odnosu na UTC.
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(new Date(utcMs));
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUtcOfLocal = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour === 24 ? 0 : map.hour,
    map.minute,
    map.second,
  );
  return asUtcOfLocal - utcMs;
}

// Pretvara "zidno" vrijeme salona (npr. 17. jun 09:30 u Sarajevu) u tačan UTC Date.
export function salonWallToUtc(
  year: number,
  month1to12: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const guess = Date.UTC(year, month1to12 - 1, day, hour, minute, 0);
  const offset = tzOffsetMs(guess, SALON_TZ);
  return new Date(guess - offset);
}

// Formatira UTC Date u "HH:MM" prema lokalnom vremenu salona.
export function formatSalonTime(date: Date): string {
  return new Intl.DateTimeFormat("sr-Latn", {
    timeZone: SALON_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

// Vraća dan u sedmici (0=ned..6=sub) za dati "YYYY-MM-DD" u zoni salona.
export function danUSedmici(year: number, month1to12: number, day: number): number {
  // Podne odabranog dana u salonu — sigurno pada u isti datum bez obzira na DST.
  const utc = salonWallToUtc(year, month1to12, day, 12, 0);
  const naziv = new Intl.DateTimeFormat("en-US", {
    timeZone: SALON_TZ,
    weekday: "short",
  }).format(utc);
  const mapa: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return mapa[naziv] ?? 0;
}

// Vraća lokalne komponente salona za dati UTC Date (za validaciju radnog vremena).
export function salonLocalParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SALON_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour === 24 ? 0 : map.hour,
    minute: map.minute,
  };
}

export const DANI_DUGI = [
  "nedjelja",
  "ponedjeljak",
  "utorak",
  "srijeda",
  "četvrtak",
  "petak",
  "subota",
];

export const MJESECI = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

function veliko(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// "Srijeda, 18. jun" (ijekavica) prema vremenu salona.
export function formatSalonDatumDugi(date: Date): string {
  const lp = salonLocalParts(date);
  const dan = danUSedmici(lp.year, lp.month, lp.day);
  return `${veliko(DANI_DUGI[dan])}, ${lp.day}. ${MJESECI[lp.month - 1]}`;
}

// "18. jun" — kratko.
export function formatSalonDatumKratki(date: Date): string {
  const lp = salonLocalParts(date);
  return `${lp.day}. ${MJESECI[lp.month - 1]}`;
}

// Ljudsko odbrojavanje do termina: "danas", "sutra", "za 3 dana", "prošlo".
export function odbrojavanje(date: Date): string {
  const sada = salonLocalParts(new Date());
  const cilj = salonLocalParts(date);
  const a = Date.UTC(sada.year, sada.month - 1, sada.day);
  const b = Date.UTC(cilj.year, cilj.month - 1, cilj.day);
  const dana = Math.round((b - a) / 86_400_000);
  if (dana < 0) return "prošlo";
  if (dana === 0) return "danas";
  if (dana === 1) return "sutra";
  return `za ${dana} dana`;
}

// Parsira "YYYY-MM-DD" u {year, month, day}; vraća null ako format nije ispravan.
export function parseDatum(
  datum: string,
): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}
