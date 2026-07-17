import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return { title: t("metaTitle") };
}

const SECTIONS = [
  "collect",
  "use",
  "storage",
  "rights",
  "contact",
] as const;

export default async function PrivatnostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPage");
  const nav = await getTranslations("nav");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-gutter">
          <Link href="/" className="flex items-center gap-2">
            <Icon name="content_cut" className="text-3xl text-blood-red" />
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
        <article className="mx-auto max-w-2xl">
          <h1 className="font-headline-lg text-4xl uppercase text-pure-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm text-muted-gray">{t("updated")}</p>

          <div className="mt-12 flex flex-col gap-10">
            {SECTIONS.map((key) => (
              <section key={key}>
                <h2 className="font-accent-label text-sm uppercase tracking-widest text-blood-red">
                  {t(`${key}Title`)}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-gray">
                  {t(`${key}Text`)}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
