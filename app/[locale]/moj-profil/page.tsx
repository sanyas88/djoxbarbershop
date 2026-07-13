import { Link } from "@/i18n/navigation";
import { redirect as nextRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { withLocale } from "@/lib/locale-path";
import { OtkaziDugme } from "@/components/profil/OtkaziDugme";
import { serviceI18nKey } from "@/lib/service-i18n";
import {
  formatSalonDatumDugi,
  formatSalonDatumKratki,
  formatSalonTime,
  odbrojavanje,
} from "@/lib/time";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return { title: t("metaTitle") };
}

export const dynamic = "force-dynamic";

export default async function MojProfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("profile");
  const tNav = await getTranslations("nav");
  const tServices = await getTranslations("services");

  const user = await getOrCreateUser();
  if (!user) nextRedirect(withLocale(locale, "/sign-in"));

  function serviceName(naziv?: string | null) {
    if (!naziv) return t("appointment");
    const key = serviceI18nKey(naziv);
    return key ? tServices(`${key}.name`) : naziv;
  }

  const sada = new Date();

  const [nadolazeci, protekli] = await Promise.all([
    prisma.rezervacija.findMany({
      where: {
        userId: user.id,
        status: { in: ["POTVRDJENO", "NA_CEKANJU"] },
        pocetak: { gte: sada },
      },
      orderBy: { pocetak: "asc" },
      include: { usluga: { select: { naziv: true, cijena: true, trajanje: true } } },
    }),
    prisma.rezervacija.findMany({
      where: {
        userId: user.id,
        status: "POTVRDJENO",
        pocetak: { lt: sada },
      },
      orderBy: { pocetak: "desc" },
      include: { usluga: { select: { naziv: true } } },
    }),
  ]);

  const brojPoseta = protekli.length;
  const sledeci = nadolazeci[0] ?? null;
  const ostali = nadolazeci.slice(1);
  const posljednjaPosjeta = protekli[0] ?? null;

  const obim = 440;
  const popunjeno = Math.min(brojPoseta, 10) / 10;
  const offset = obim * (1 - popunjeno);

  const greeting = t("greeting", {
    ime: user.ime ? `, ${user.ime}` : "",
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-50 w-full border-b border-border-subtle bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-gutter">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-blood-red">content_cut</span>
            <span className="font-headline-lg text-2xl uppercase tracking-tighter text-on-background md:text-3xl">
              DJOX <span className="text-blood-red">BARBERSHOP</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="font-medium text-muted-gray transition-colors hover:text-blood-red">
              {tNav("home")}
            </Link>
            <Link href="/#usluge" className="font-medium text-muted-gray transition-colors hover:text-blood-red">
              {tNav("services")}
            </Link>
            <span className="font-bold text-blood-red">{tNav("profile")}</span>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/zakazivanje"
              className="hidden rounded-lg bg-blood-red px-6 py-3 font-button-text text-sm uppercase tracking-widest text-pure-white transition-all hover:brightness-110 sm:block"
            >
              {tNav("book")}
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-gutter pb-24 pt-32">
        <section className="mb-stack-lg">
          <p className="font-script text-4xl text-blood-red md:text-5xl">{greeting}</p>
          <p className="font-body-md text-muted-gray">{t("greetingSub")}</p>
        </section>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-surface-container p-stack-lg md:col-span-8">
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blood-red">event_available</span>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-gray">
                  {t("nextAppointment")}
                </h2>
              </div>

              {sledeci ? (
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="font-headline-lg text-3xl md:text-5xl">
                      {serviceName(sledeci.usluga?.naziv)}
                    </p>
                    <p className="font-body-md text-muted-gray">
                      {formatSalonDatumDugi(sledeci.pocetak)} • {formatSalonTime(sledeci.pocetak)}h
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border border-blood-red/20 bg-blood-red/10 px-6 py-4">
                    <span className="font-headline-lg text-3xl text-blood-red">
                      {odbrojavanje(sledeci.pocetak)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-tighter text-blood-red/80">
                      {t("countdown")}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-headline-lg text-3xl md:text-4xl">{t("noAppointments")}</p>
                  <p className="mt-2 font-body-md text-muted-gray">{t("noAppointmentsSub")}</p>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-8 flex gap-4">
              {sledeci ? (
                <OtkaziDugme rezervacijaId={sledeci.id} varijanta="dugme" />
              ) : (
                <Link
                  href="/zakazivanje"
                  className="rounded-lg bg-blood-red px-6 py-3 font-button-text text-xs uppercase tracking-widest text-pure-white transition-all hover:brightness-110"
                >
                  {t("book")}
                </Link>
              )}
            </div>

            <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-5">
              <span
                className="material-symbols-outlined text-[200px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                content_cut
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-container p-stack-lg text-center md:col-span-4">
            <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-muted-gray">
              {t("visitCount")}
            </h2>
            <div className="relative mb-6 flex items-center justify-center">
              <svg className="h-40 w-40 -rotate-90">
                <circle className="text-surface-container-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8" />
                <circle className="text-blood-red" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray={obim} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-lg text-4xl">{brojPoseta}</span>
                <span className="font-caption uppercase tracking-widest text-muted-gray">{t("visits")}</span>
              </div>
            </div>
            <p className="font-body-md text-sm text-on-surface">
              {brojPoseta === 0 ? t("firstVisit") : t("thanksReturn")}
            </p>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface-container p-stack-lg md:col-span-12 lg:col-span-7">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted-gray">
              {t("upcoming")}
            </h2>
            <div className="space-y-4">
              {ostali.length === 0 && (
                <p className="text-sm text-muted-gray">
                  {sledeci ? t("noOther") : t("noneScheduled")}
                </p>
              )}
              {ostali.map((termin) => (
                <div
                  key={termin.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-surface-container-high/40 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blood-red/10 text-blood-red">
                      <span className="material-symbols-outlined">content_cut</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{serviceName(termin.usluga?.naziv)}</p>
                      <p className="text-xs text-muted-gray">
                        {formatSalonDatumKratki(termin.pocetak)} • {formatSalonTime(termin.pocetak)}h
                      </p>
                    </div>
                  </div>
                  <OtkaziDugme rezervacijaId={termin.id} />
                </div>
              ))}
            </div>
            <Link
              href="/zakazivanje"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle py-4 font-button-text text-xs uppercase text-muted-gray transition-all hover:border-blood-red/40 hover:text-blood-red"
            >
              <span className="material-symbols-outlined">add_circle</span> {t("bookNew")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <div className="flex items-center gap-6 rounded-xl border border-border-subtle bg-surface-container p-stack-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blood-red/10 text-blood-red">
                <span className="material-symbols-outlined text-3xl">history</span>
              </div>
              <div>
                <h2 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-gray">
                  {t("lastVisit")}
                </h2>
                <p className="font-accent-label text-on-surface">
                  {posljednjaPosjeta ? formatSalonDatumDugi(posljednjaPosjeta.pocetak) : t("noVisitsYet")}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-border-subtle bg-gradient-to-br from-blood-red/10 to-transparent p-stack-lg">
              <div>
                <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-on-surface">
                  {t("ctaTitle")}
                </h2>
                <p className="text-sm text-muted-gray">{t("ctaText")}</p>
              </div>
              <Link
                href="/zakazivanje"
                className="mt-4 inline-block rounded-lg bg-blood-red px-6 py-3 text-center font-button-text text-xs uppercase tracking-widest text-pure-white transition-all hover:brightness-110"
              >
                {t("bookNow")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-subtle bg-surface-container-lowest py-10">
        <div className="mx-auto max-w-[1280px] px-gutter text-center">
          <p className="text-xs uppercase tracking-widest text-muted-gray">{t("copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
