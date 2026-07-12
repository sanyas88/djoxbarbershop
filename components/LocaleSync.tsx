"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Postavlja <html lang> prema aktivnom jeziku. */
export function LocaleSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "sr-Latn";
  }, [locale]);

  return null;
}
