import { SignUp } from "@clerk/nextjs";
import { setRequestLocale } from "next-intl/server";
import { withLocale } from "@/lib/locale-path";
import { safeAppRedirect } from "@/lib/booking-draft";

export default async function SignUpPage({
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
  const signInUrl = withLocale(locale, "/sign-in");
  const afterAuthUrl = safeAppRedirect(redirect_url, profilUrl);
  const signInWithRedirect = `${signInUrl}?redirect_url=${encodeURIComponent(afterAuthUrl)}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignUp
        routing="path"
        path={withLocale(locale, "/sign-up")}
        signInUrl={signInWithRedirect}
        forceRedirectUrl={afterAuthUrl}
        fallbackRedirectUrl={afterAuthUrl}
      />
    </div>
  );
}
