"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: "bs" | "en") {
    if (next === locale) return;
    // Bosanski (default) ide na / bez prefiksa.
    router.replace(pathname || "/", { locale: next });
  }

  return (
    <div className="flex items-center rounded-lg border border-border-subtle bg-surface-container-high p-0.5 text-xs font-bold uppercase tracking-widest">
      <button
        type="button"
        onClick={() => switchTo("bs")}
        className={`rounded-md px-2.5 py-1.5 transition-colors ${
          locale === "bs" ? "bg-blood-red text-pure-white" : "text-muted-gray hover:text-pure-white"
        }`}
        aria-pressed={locale === "bs"}
      >
        BS
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`rounded-md px-2.5 py-1.5 transition-colors ${
          locale === "en" ? "bg-blood-red text-pure-white" : "text-muted-gray hover:text-pure-white"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
