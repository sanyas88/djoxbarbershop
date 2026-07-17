"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth, useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { withLocale } from "@/lib/locale-path";
import { isClerkEnabledClient } from "@/lib/clerk-config-client";

function HeaderAuthPlain() {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <Link
      href={withLocale(locale, "/sign-in")}
      className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
    >
      {t("login")}
    </Link>
  );
}

function HeaderAuthWithClerk() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const profilUrl = withLocale(locale, "/moj-profil");
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal" fallbackRedirectUrl={profilUrl}>
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

export function HeaderAuth() {
  if (!isClerkEnabledClient()) {
    return <HeaderAuthPlain />;
  }
  return <HeaderAuthWithClerk />;
}
