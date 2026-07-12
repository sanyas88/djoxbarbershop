// Vremenska zona salona (Bosna i Hercegovina).
export const SALON_TZ = "Europe/Sarajevo";

// Radno vrijeme po danu u sedmici (0 = nedjelja ... 6 = subota).
// open/close su sati u lokalnom vremenu salona; null = neradni dan.
export const RADNO_VRIJEME: Record<number, { open: number; close: number } | null> = {
  0: { open: 11, close: 18 }, // Nedjelja
  1: null, // Ponedjeljak — zatvoreno
  2: { open: 8, close: 18 }, // Utorak
  3: { open: 8, close: 18 }, // Srijeda
  4: { open: 8, close: 18 }, // Četvrtak
  5: { open: 8, close: 18 }, // Petak
  6: { open: 11, close: 18 }, // Subota
};

// Razmak između početaka termina (u minutima).
export const SLOT_KORAK_MIN = 30;

// Koliko unaprijed se najranije može zakazati (u minutima) — sprečava zakazivanje "za 2 minuta".
export const MIN_NAJAVA_MIN = 60;

// Koliko dana unaprijed je kalendar otvoren za zakazivanje.
export const MAX_DANA_UNAPRIJED = 30;

// Statusi koji "zauzimaju" termin (slot se tada ne nudi kao slobodan).
export const ZAUZETI_STATUSI = ["NA_CEKANJU", "POTVRDJENO", "BLOKIRANO"] as const;
