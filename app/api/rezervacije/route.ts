import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";
import { RADNO_VRIJEME, MIN_NAJAVA_MIN, MAX_DANA_UNAPRIJED } from "@/lib/booking-config";
import { salonLocalParts, danUSedmici } from "@/lib/time";

// POST /api/rezervacije — klijent potvrđuje rezervaciju.
// Zaštita: traži prijavljenog korisnika (Clerk); termin se upisuje na NJEGOV nalog.
export async function POST(req: NextRequest) {
  // 1) Mora biti prijavljen — getOrCreateUser vraća null ako nema Clerk sesije.
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json(
      { greska: "Morate biti prijavljeni da biste zakazali termin." },
      { status: 401 },
    );
  }

  let body: { uslugaId?: string; pocetak?: string; napomena?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ greska: "Neispravan zahtjev." }, { status: 400 });
  }

  const { uslugaId, pocetak, napomena } = body;
  if (!uslugaId || !pocetak) {
    return NextResponse.json(
      { greska: "Nedostaje usluga ili termin." },
      { status: 400 },
    );
  }

  const pocetakDate = new Date(pocetak);
  if (Number.isNaN(pocetakDate.getTime())) {
    return NextResponse.json({ greska: "Neispravan termin." }, { status: 400 });
  }

  // 2) Usluga mora postojati i biti aktivna.
  const usluga = await prisma.usluga.findFirst({
    where: { id: uslugaId, aktivna: true },
    select: { id: true, trajanje: true },
  });
  if (!usluga) {
    return NextResponse.json({ greska: "Usluga ne postoji." }, { status: 404 });
  }

  const krajDate = new Date(pocetakDate.getTime() + usluga.trajanje * 60_000);

  // 3) Ne smije biti u prošlosti (uz minimalnu najavu).
  if (pocetakDate.getTime() < Date.now() + MIN_NAJAVA_MIN * 60_000) {
    return NextResponse.json(
      { greska: "Termin je prekratko najavljen ili je u prošlosti." },
      { status: 400 },
    );
  }

  // 4) Ne smije biti predaleko u budućnosti.
  if (pocetakDate.getTime() > Date.now() + MAX_DANA_UNAPRIJED * 86_400_000) {
    return NextResponse.json(
      { greska: "Termin je previše daleko u budućnosti." },
      { status: 400 },
    );
  }

  // 5) Mora biti unutar radnog vremena tog dana.
  const lp = salonLocalParts(pocetakDate);
  const lpKraj = salonLocalParts(krajDate);
  const dan = danUSedmici(lp.year, lp.month, lp.day);
  const radno = RADNO_VRIJEME[dan];
  const pocetakMin = lp.hour * 60 + lp.minute;
  const krajMin = lpKraj.hour * 60 + lpKraj.minute;
  if (
    !radno ||
    pocetakMin < radno.open * 60 ||
    krajMin > radno.close * 60 ||
    lpKraj.day !== lp.day
  ) {
    return NextResponse.json(
      { greska: "Termin je izvan radnog vremena." },
      { status: 400 },
    );
  }

  // 6) Provjeri preklapanje sa zauzetim terminima (sprečava duplo bukiranje).
  const preklapanje = await prisma.rezervacija.findFirst({
    where: {
      status: { in: ["NA_CEKANJU", "POTVRDJENO", "BLOKIRANO"] },
      pocetak: { lt: krajDate },
      kraj: { gt: pocetakDate },
    },
    select: { id: true },
  });
  if (preklapanje) {
    return NextResponse.json(
      { greska: "Taj termin je upravo zauzet. Izaberite drugi." },
      { status: 409 },
    );
  }

  // 7) Upis rezervacije — status POTVRDJENO (klijentska rezervacija).
  const rezervacija = await prisma.rezervacija.create({
    data: {
      userId: user.id,
      uslugaId: usluga.id,
      pocetak: pocetakDate,
      kraj: krajDate,
      status: "POTVRDJENO",
      napomena: napomena?.slice(0, 500) || null,
    },
    select: { id: true, pocetak: true, kraj: true, status: true },
  });

  // (Zapier sinhronizacija — Calendar event + mejl — dolazi u Fazi 7.)

  return NextResponse.json({ ok: true, rezervacija }, { status: 201 });
}
