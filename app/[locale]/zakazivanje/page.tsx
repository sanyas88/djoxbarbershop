import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookingFlow } from "@/components/booking/BookingFlow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ZakazivanjePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");
  const nav = await getTranslations("nav");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-gutter">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-blood-red">
              content_cut
            </span>
            <span className="font-headline-lg text-2xl uppercase tracking-tighter text-on-background">
              DJOX <span className="text-blood-red">BARBERSHOP</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted-gray transition-colors hover:text-pure-white"
          >
            {nav("backHome")}
          </Link>
        </div>
      </header>

      <main className="px-gutter py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h4 className="font-script text-3xl text-blood-red">{t("label")}</h4>
          <h1 className="font-headline-lg text-4xl uppercase text-pure-white sm:text-5xl">
            {t("title")}
          </h1>
        </div>
        <BookingFlow />
      </main>
    </div>
  );
}
