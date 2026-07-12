"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth, useUser, UserButton, SignInButton } from "@clerk/nextjs";

export function HeaderAuth() {
  const t = useTranslations("nav");
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal" fallbackRedirectUrl="/moj-profil">
        <button className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red">
          {t("login")}
        </button>
      </SignInButton>
    );
  }

  const jeAdmin =
    (user?.publicMetadata as { role?: string } | undefined)?.role === "admin";

  return (
    <>
      {jeAdmin && (
        <Link
          href="/admin"
          className="hidden md:inline font-medium text-muted-gray hover:text-blood-red transition-colors duration-300"
        >
          {t("admin")}
        </Link>
      )}
      <Link
        href="/moj-profil"
        className="hidden md:inline font-medium text-muted-gray hover:text-blood-red transition-colors duration-300"
      >
        {t("myProfile")}
      </Link>
      <UserButton />
    </>
  );
}
