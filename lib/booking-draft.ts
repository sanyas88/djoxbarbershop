/** Privremeni draft rezervacije (localStorage) — preživljava OAuth redirect. */

export type BookingDraft = {
  uslugaId: string;
  datum: string;
  slot: { pocetak: string; vrijeme: string };
  napomena: string;
  pendingConfirm: boolean;
};

const KEY = "djox-booking-draft";

function storage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function saveBookingDraft(draft: BookingDraft): void {
  try {
    storage()?.setItem(KEY, JSON.stringify(draft));
  } catch {
    // private mode / quota
  }
}

export function loadBookingDraft(): BookingDraft | null {
  try {
    const raw = storage()?.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as BookingDraft;
    if (!data?.uslugaId || !data?.datum || !data?.slot?.pocetak) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearBookingDraft(): void {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // ignore
  }
}

/** Dozvoli samo relativne putanje unutar sajta. */
export function safeAppRedirect(url: string | undefined, fallback: string): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return fallback;
  return url;
}
