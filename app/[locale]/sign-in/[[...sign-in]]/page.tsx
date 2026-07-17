import { SignIn } from "@clerk/nextjs";
import { setRequestLocale } from "next-intl/server";
import { withLocale } from "@/lib/locale-path";
import { safeAppRedirect } from "@/lib/booking-draft";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const { locale } = await params;
  const { redirect_url } = await searchParams;
  setRequestLocale(locale);

  const profilUrl = withLocale(locale, "/moj-profil");
  const signUpUrl = withLocale(locale, "/sign-up");
  const afterAuthUrl = safeAppRedirect(redirect_url, profilUrl);
  const signUpWithRedirect = `${signUpUrl}?redirect_url=${encodeURIComponent(afterAuthUrl)}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignIn
        routing="path"
        path={withLocale(locale, "/sign-in")}
        signUpUrl={signUpWithRedirect}
        forceRedirectUrl={afterAuthUrl}
        fallbackRedirectUrl={afterAuthUrl}
        signUpForceRedirectUrl={afterAuthUrl}
        signUpFallbackRedirectUrl={afterAuthUrl}
      />
    </div>
  );
}
