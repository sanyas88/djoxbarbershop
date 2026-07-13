import { SignIn } from "@clerk/nextjs";
import { setRequestLocale } from "next-intl/server";
import { withLocale } from "@/lib/locale-path";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profilUrl = withLocale(locale, "/moj-profil");
  const signUpUrl = withLocale(locale, "/sign-up");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignIn
        routing="path"
        path={withLocale(locale, "/sign-in")}
        signUpUrl={signUpUrl}
        forceRedirectUrl={profilUrl}
        fallbackRedirectUrl={profilUrl}
      />
    </div>
  );
}
