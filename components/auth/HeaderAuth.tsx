"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Marketing header — bez Clerk JS-a (samo linkovi). */
export function HeaderAuth() {
  const t = useTranslations("nav");

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Link
        href="/moj-profil"
        className="hidden sm:inline font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
      >
        {t("myProfile")}
      </Link>
      <Link
        href="/sign-in"
        className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
      >
        {t("login")}
      </Link>
    </div>
  );
}
