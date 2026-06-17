import { SALON_TZ } from "@/lib/booking-config";
import { formatSalonDatumDugi, formatSalonTime } from "@/lib/time";

// Naziv salona — koristi se u naslovima eventova i mejlovima.
const SALON = "Djoxbarbershop";

function validanUrl(url?: string): url is string {
  return !!url && url.startsWith("https://") && !url.includes("PASTE");
}

// Šalje JSON payload na Zapier "Catch Hook" webhook.
// Otporno na greške: ako URL nije podešen ili Zapier ne odgovori, NE ruši rezervaciju
// (Neon je izvor istine — kalendar/mejl su samo jednosmjeran ispis).
async function posaljiNaZapier(
  url: string | undefined,
  payload: Record<string, unknown>,
  oznaka: string,
): Promise<void> {
  if (!validanUrl(url)) {
    console.warn(`[zapier] ${oznaka}: webhook URL nije podešen — preskačem slanje.`);
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[zapier] ${oznaka}: HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`[zapier] ${oznaka}: greška pri slanju`, err);
  } finally {
    clearTimeout(timeout);
  }
}

// OKIDAČ 1 — klijentska rezervacija (status POTVRDJENO).
// Zap mapira: Google Calendar event + potvrdni mejl klijentu.
export async function posaljiRezervacijuNaZapier(data: {
  imeKlijenta: string;
  emailKlijenta: string;
  usluga: string;
  cijena: number;
  trajanjeMin: number;
  pocetak: Date;
  kraj: Date;
  napomena?: string | null;
}): Promise<void> {
  const payload = {
    tip: "rezervacija",
    salon: SALON,
    naslovDogadjaja: `${data.usluga} — ${data.imeKlijenta}`,
    imeKlijenta: data.imeKlijenta,
    emailKlijenta: data.emailKlijenta,
    usluga: data.usluga,
    cijena: `${data.cijena} KM`,
    trajanjeMin: data.trajanjeMin,
    // ISO (UTC) za Google Calendar start/end + vremenska zona.
    pocetakIso: data.pocetak.toISOString(),
    krajIso: data.kraj.toISOString(),
    vremenskaZona: SALON_TZ,
    // Ljudski čitljivo (ijekavica) za tijelo mejla.
    datum: formatSalonDatumDugi(data.pocetak),
    vrijeme: formatSalonTime(data.pocetak),
    napomena: data.napomena ?? "",
  };
  await posaljiNaZapier(process.env.ZAPIER_WEBHOOK_REZERVACIJA, payload, "rezervacija");
}

// OKIDAČ 2 — admin blokada (status BLOKIRANO).
// Zap mapira: Google Calendar event "🚫 Zauzeto" — BEZ mejla (zaseban Zap).
export async function posaljiBlokaduNaZapier(data: {
  pocetak: Date;
  kraj: Date;
  napomena?: string | null;
}): Promise<void> {
  const payload = {
    tip: "blokada",
    salon: SALON,
    naslovDogadjaja: "🚫 Zauzeto",
    pocetakIso: data.pocetak.toISOString(),
    krajIso: data.kraj.toISOString(),
    vremenskaZona: SALON_TZ,
    datum: formatSalonDatumDugi(data.pocetak),
    vrijemeOd: formatSalonTime(data.pocetak),
    vrijemeDo: formatSalonTime(data.kraj),
    napomena: data.napomena ?? "",
  };
  await posaljiNaZapier(process.env.ZAPIER_WEBHOOK_BLOKADA, payload, "blokada");
}
