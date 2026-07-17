"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Marketing header — bez Clerk JS-a (samo linkovi). Na mobilnom je profil u bottom navu. */
export function HeaderAuth() {
  const t = useTranslations("nav");

  return (
    <div className="hidden items-center gap-4 md:flex">
      <Link
        href="/moj-profil"
        className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
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
