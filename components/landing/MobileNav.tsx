"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileNav() {
  const t = useTranslations("nav");

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface-container/95 backdrop-blur-xl border-t border-border-subtle rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] h-16 flex justify-around items-center px-4">
      <a className="flex flex-col items-center justify-center text-blood-red font-bold active:scale-95 transition-transform" href="#pocetna">
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] uppercase mt-1">{t("home")}</span>
      </a>
      <a className="flex flex-col items-center justify-center text-muted-gray active:scale-95 transition-transform" href="#usluge">
        <span className="material-symbols-outlined">content_cut</span>
        <span className="text-[10px] uppercase mt-1">{t("services")}</span>
      </a>
      <Link className="flex flex-col items-center justify-center text-muted-gray active:scale-95 transition-transform" href="/zakazivanje">
        <span className="material-symbols-outlined">event_available</span>
        <span className="text-[10px] uppercase mt-1">{t("appointments")}</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-muted-gray active:scale-95 transition-transform" href="/moj-profil">
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] uppercase mt-1">{t("profile")}</span>
      </Link>
    </nav>
  );
}
