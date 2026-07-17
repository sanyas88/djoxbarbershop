import { Link } from "@/i18n/navigation";
import { redirect as nextRedirect } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { withLocale } from "@/lib/locale-path";
import { BlokadaForma } from "@/components/admin/BlokadaForma";
import { AdminAkcijaDugme } from "@/components/admin/AdminAkcijaDugme";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  salonLocalParts,
  salonWallToUtc,
  danUSedmici,
  formatSalonTime,
  formatSalonDatumDugi,
  formatSalonDatumKratki,
} from "@/lib/time";

export const metadata: Metadata = {
  title: "Admin panel | Djox Barbershop",
};

export const dynamic = "force-dynamic";

const STATUS_OZNAKA: Record<string, { tekst: string; klasa: string }> = {
  NA_CEKANJU: {
    tekst: "Na čekanju",
    klasa: "bg-blood-red/10 text-blood-red",
  },
  POTVRDJENO: {
    tekst: "Potvrđeno",
    klasa: "bg-blood-red/10 text-blood-red",
  },
  OTKAZANO: {
    tekst: "Otkazano",
    klasa: "bg-surface-container-highest text-muted-gray",
  },
  BLOKIRANO: {
    tekst: "Blokirano",
    klasa: "bg-surface-container-highest text-muted-gray",
  },
};

function trajanjeMin(pocetak: Date, kraj: Date): number {
  return Math.round((kraj.getTime() - pocetak.getTime()) / 60_000);
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getOrCreateUser();
  if (!user) nextRedirect(withLocale(locale, "/sign-in"));
  if (user.uloga !== "ADMIN") nextRedirect(withLocale(locale, "/"));

  const sada = new Date();
  const lp = salonLocalParts(sada);

  // Granice "danas", "ova sedmica" i "ovaj mjesec" u zoni salona.
  const danStart = salonWallToUtc(lp.year, lp.month, lp.day, 0, 0);
  const danEnd = salonWallToUtc(lp.year, lp.month, lp.day + 1, 0, 0);

  const danSedmice = danUSedmici(lp.year, lp.month, lp.day); // 0=ned..6=sub
  const odPonedjeljka = (danSedmice + 6) % 7; // koliko dana od ponedjeljka
  const sedmicaStart = salonWallToUtc(lp.year, lp.month, lp.day - odPonedjeljka, 0, 0);
  const sedmicaEnd = salonWallToUtc(
    lp.year,
    lp.month,
    lp.day - odPonedjeljka + 7,
    0,
    0,
  );

  const mjesecStart = salonWallToUtc(lp.year, lp.month, 1, 0, 0);
  const mjesecEnd = salonWallToUtc(lp.year, lp.month + 1, 1, 0, 0);

  const AKTIVNI = ["POTVRDJENO", "NA_CEKANJU"] as const;

  const [
    brojDanas,
    brojSedmica,
    mjesecRez,
    topUsluga,
    danasRaspored,
    sveNadolazece,
  ] = await Promise.all([
    prisma.rezervacija.count({
      where: {
        status: { in: [...AKTIVNI] },
        pocetak: { gte: danStart, lt: danEnd },
      },
    }),
    prisma.rezervacija.count({
      where: {
        status: { in: [...AKTIVNI] },
        pocetak: { gte: sedmicaStart, lt: sedmicaEnd },
      },
    }),
    prisma.rezervacija.findMany({
      where: {
        status: "POTVRDJENO",
        pocetak: { gte: mjesecStart, lt: mjesecEnd },
      },
      select: { usluga: { select: { cijena: true } } },
    }),
    prisma.rezervacija.groupBy({
      by: ["uslugaId"],
      where: { status: "POTVRDJENO", uslugaId: { not: null } },
      _count: { uslugaId: true },
      orderBy: { _count: { uslugaId: "desc" } },
      take: 1,
    }),
    prisma.rezervacija.findMany({
      where: {
        status: { in: ["POTVRDJENO", "NA_CEKANJU", "BLOKIRANO"] },
        pocetak: { gte: danStart, lt: danEnd },
      },
      orderBy: { pocetak: "asc" },
      include: {
        usluga: { select: { naziv: true } },
        user: { select: { ime: true, prezime: true } },
      },
    }),
    prisma.rezervacija.findMany({
      where: {
        status: { in: ["POTVRDJENO", "NA_CEKANJU", "BLOKIRANO"] },
        pocetak: { gte: sada },
      },
      orderBy: { pocetak: "asc" },
      take: 30,
      include: {
        usluga: { select: { naziv: true } },
        user: { select: { ime: true, prezime: true } },
      },
    }),
  ]);

  const prihod = mjesecRez.reduce(
    (s, r) => s + (r.usluga ? Number(r.usluga.cijena) : 0),
    0,
  );

  let najtrazenija = "—";
  let najtrazenijaUdio = "";
  if (topUsluga[0]?.uslugaId) {
    const u = await prisma.usluga.findUnique({
      where: { id: topUsluga[0].uslugaId },
      select: { naziv: true },
    });
    najtrazenija = u?.naziv ?? "—";
    const ukupnoPotvrdjenih = await prisma.rezervacija.count({
      where: { status: "POTVRDJENO", uslugaId: { not: null } },
    });
    if (ukupnoPotvrdjenih > 0) {
      const procenat = Math.round(
        (topUsluga[0]._count.uslugaId / ukupnoPotvrdjenih) * 100,
      );
      najtrazenijaUdio = `${procenat}% svih rezervacija`;
    }
  }

  const ime = (u: { ime: string; prezime: string }) =>
    `${u.ime}${u.prezime ? ` ${u.prezime.charAt(0)}.` : ""}`.trim() || "Klijent";

  const kartice: {
    oznaka: string;
    ikona: IconName;
    vrijednost: string;
    opis: string;
  }[] = [
    {
      oznaka: "Danas",
      ikona: "calendar_today",
      vrijednost: String(brojDanas),
      opis: "Zakazanih termina za danas",
    },
    {
      oznaka: "Ova sedmica",
      ikona: "trending_up",
      vrijednost: String(brojSedmica),
      opis: "Termina ove sedmice",
    },
    {
      oznaka: "Prihod (mjesec)",
      ikona: "payments",
      vrijednost: `${prihod.toLocaleString("sr-Latn")} KM`,
      opis: "Potvrđene rezervacije ovog mjeseca",
    },
    {
      oznaka: "Najtraženija usluga",
      ikona: "star",
      vrijednost: najtrazenija,
      opis: najtrazenijaUdio || "Još nema podataka",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border-subtle bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-gutter">
          <Link href="/" className="flex items-center gap-2">
            <Icon name="content_cut" className="text-3xl text-blood-red" />
            <span className="font-headline-lg text-2xl uppercase tracking-tighter text-on-background md:text-3xl">
              DJOX <span className="text-blood-red">BARBERSHOP</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <span className="font-bold text-blood-red">Admin</span>
            <Link
              href="/"
              className="font-medium text-muted-gray transition-colors hover:text-blood-red"
            >
              Početna
            </Link>
            <Link
              href="/moj-profil"
              className="font-medium text-muted-gray transition-colors hover:text-blood-red"
            >
              Moj profil
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/zakazivanje"
              className="hidden rounded-lg bg-blood-red px-6 py-3 font-button-text text-sm uppercase tracking-widest text-pure-white transition-all hover:brightness-110 sm:block"
            >
              Zakaži termin
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-gutter pb-24 pt-32">
        {/* Pozdrav */}
        <section className="mb-stack-lg">
          <p className="font-script text-4xl text-blood-red md:text-5xl">
            Dobar dan{user.ime ? `, ${user.ime}` : ""}
          </p>
          <p className="font-body-md text-muted-gray">
            Dobrodošli nazad u komandni centar. Pogledajte današnji učinak.
          </p>
        </section>

        {/* Stat kartice */}
        <section className="mb-section-gap grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {kartice.map((k) => (
            <div
              key={k.oznaka}
              className="group rounded-xl border border-border-subtle bg-charcoal-bg p-stack-lg transition-all hover:border-blood-red/50"
            >
              <div className="mb-stack-md flex items-start justify-between">
                <p className="font-caption uppercase tracking-widest text-muted-gray">
                  {k.oznaka}
                </p>
                <Icon name={k.ikona} className="text-blood-red" />
              </div>
              <h3 className="font-headline-lg text-3xl text-pure-white transition-transform duration-300 group-hover:scale-105 md:text-4xl">
                {k.vrijednost}
              </h3>
              <p className="mt-1 text-caption text-on-primary-container">{k.opis}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          {/* Današnji raspored */}
          <div className="lg:col-span-8">
            <div className="mb-stack-lg flex items-center justify-between">
              <h2 className="font-headline-lg text-2xl text-pure-white md:text-3xl">
                Današnji raspored
              </h2>
              <span className="text-caption uppercase tracking-widest text-muted-gray">
                {formatSalonDatumDugi(sada)}
              </span>
            </div>

            <div className="space-y-stack-md">
              {danasRaspored.length === 0 && (
                <div className="rounded-xl border border-dashed border-border-subtle p-10 text-center text-muted-gray">
                  Danas nema zakazanih termina.
                </div>
              )}

              {danasRaspored.map((t) => {
                const jeBlok = t.status === "BLOKIRANO";
                const naslov = jeBlok
                  ? "🚫 Zauzeto"
                  : ime(t.user);
                const podnaslov = jeBlok
                  ? t.napomena ?? "Blokiran termin"
                  : t.usluga?.naziv ?? "Termin";
                const oznaka = STATUS_OZNAKA[t.status];
                return (
                  <div
                    key={t.id}
                    className={`group flex items-center justify-between rounded-xl border-l-4 bg-charcoal-bg p-6 transition-all hover:bg-surface-container ${
                      jeBlok ? "border-muted-gray/30" : "border-blood-red"
                    }`}
                  >
                    <div className="flex items-center gap-gutter">
                      <div className="min-w-[60px] text-center">
                        <p
                          className={`font-bold ${
                            jeBlok ? "text-muted-gray" : "text-blood-red"
                          }`}
                        >
                          {formatSalonTime(t.pocetak)}
                        </p>
                        <p className="text-caption text-muted-gray">
                          {trajanjeMin(t.pocetak, t.kraj)} min
                        </p>
                      </div>
                      <div className="h-10 w-px bg-border-subtle" />
                      <div>
                        <h4 className="font-accent-label text-pure-white">{naslov}</h4>
                        <p className="text-caption text-on-primary-container">
                          {podnaslov}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-stack-lg">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${oznaka.klasa}`}
                      >
                        {oznaka.tekst}
                      </span>
                      <AdminAkcijaDugme
                        rezervacijaId={t.id}
                        labela={jeBlok ? "Ukloni" : "Otkaži"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blokiraj termin */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border-subtle bg-surface-container-low">
              <div className="flex items-center justify-between border-b border-border-subtle bg-surface-container-high/30 p-6">
                <h3 className="font-accent-label text-pure-white">Blokiraj termin</h3>
                <Icon name="block" className="text-blood-red" />
              </div>
              <div className="p-6">
                <p className="mb-stack-md text-caption text-muted-gray">
                  Označi period kao zauzet (pauza, godišnji, privatno). Klijenti ga neće
                  moći zakazati, a mejl se ne šalje.
                </p>
                <BlokadaForma />
              </div>
            </div>
          </div>
        </div>

        {/* Sve rezervacije */}
        <section className="mt-section-gap">
          <h2 className="mb-stack-lg font-headline-lg text-2xl text-pure-white md:text-3xl">
            Sve rezervacije
          </h2>
          <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container-low">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-md">
                <thead>
                  <tr className="border-b border-border-subtle text-caption uppercase text-muted-gray">
                    <th className="p-4 font-bold">Klijent</th>
                    <th className="p-4 font-bold">Usluga</th>
                    <th className="p-4 font-bold">Datum i vrijeme</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 text-right font-bold">Akcija</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {sveNadolazece.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-gray">
                        Nema nadolazećih rezervacija.
                      </td>
                    </tr>
                  )}
                  {sveNadolazece.map((t) => {
                    const jeBlok = t.status === "BLOKIRANO";
                    const oznaka = STATUS_OZNAKA[t.status];
                    return (
                      <tr
                        key={t.id}
                        className="transition-colors hover:bg-charcoal-bg/50"
                      >
                        <td className="p-4">
                          <p className="text-sm font-bold text-on-surface">
                            {jeBlok ? "🚫 Zauzeto" : ime(t.user)}
                          </p>
                        </td>
                        <td className="p-4 text-xs text-muted-gray">
                          {jeBlok
                            ? t.napomena ?? "Blokirano"
                            : t.usluga?.naziv ?? "Termin"}
                        </td>
                        <td className="p-4 text-xs text-on-surface">
                          {formatSalonDatumKratki(t.pocetak)} • {formatSalonTime(t.pocetak)}h
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${oznaka.klasa}`}
                          >
                            {oznaka.tekst}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <AdminAkcijaDugme
                            rezervacijaId={t.id}
                            labela={jeBlok ? "Ukloni" : "Otkaži"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Slim footer */}
      <footer className="border-t border-border-subtle bg-surface-container-lowest py-10">
        <div className="mx-auto max-w-[1280px] px-gutter text-center">
          <p className="text-xs uppercase tracking-widest text-muted-gray">
            © 2026 DJOX BARBERSHOP. Admin panel.
          </p>
        </div>
      </footer>
    </div>
  );
}
