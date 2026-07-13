import { SignUp } from "@clerk/nextjs";
import { setRequestLocale } from "next-intl/server";
import { withLocale } from "@/lib/locale-path";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profilUrl = withLocale(locale, "/moj-profil");
  const signInUrl = withLocale(locale, "/sign-in");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignUp
        routing="path"
        path={withLocale(locale, "/sign-up")}
        signInUrl={signInUrl}
        forceRedirectUrl={profilUrl}
        fallbackRedirectUrl={profilUrl}
      />
    </div>
  );
}
