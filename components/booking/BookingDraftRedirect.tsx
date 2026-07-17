"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { loadBookingDraft } from "@/lib/booking-draft";

/** Ako OAuth vrati na početnu umjesto na zakazivanje — vrati korisnika natrag. */
export function BookingDraftRedirect() {
  const router = useRouter();

  useEffect(() => {
    const draft = loadBookingDraft();
    if (draft?.pendingConfirm) {
      router.replace("/zakazivanje");
    }
  }, [router]);

  return null;
}
