import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RADNO_VRIJEME, SLOT_KORAK_MIN, MIN_NAJAVA_MIN } from "@/lib/booking-config";
import { salonWallToUtc, formatSalonTime, danUSedmici, parseDatum } from "@/lib/time";

// GET /api/slotovi?uslugaId=...&datum=YYYY-MM-DD
// Računa slobodne termine ISKLJUČIVO iz baze (Neon je izvor istine).
export async function GET(req: NextRequest) {
  try {
    const uslugaId = req.nextUrl.searchParams.get("uslugaId");
    const datum = req.nextUrl.searchParams.get("datum");

    if (!uslugaId || !datum) {
      return NextResponse.json(
        { greska: "Nedostaje usluga ili datum." },
        { status: 400 },
      );
    }

    const parsed = parseDatum(datum);
    if (!parsed) {
      return NextResponse.json({ greska: "Neispravan datum." }, { status: 400 });
    }
    const { year, month, day } = parsed;

    const usluga = await prisma.usluga.findFirst({
      where: { id: uslugaId, aktivna: true },
      select: { id: true, trajanje: true },
    });
    if (!usluga) {
      return NextResponse.json({ greska: "Usluga ne postoji." }, { status: 404 });
    }

    // Radno vrijeme za taj dan u sedmici.
    const dan = danUSedmici(year, month, day);
    const radno = RADNO_VRIJEME[dan];
    if (!radno) {
      // Neradni dan — nema slotova.
      return NextResponse.json({ slotovi: [], zatvoreno: true });
    }

    const trajanjeMs = usluga.trajanje * 60_000;
    const sada = Date.now();
    const najraniji = sada + MIN_NAJAVA_MIN * 60_000;

    // UTC granice radnog dana za dohvat postojećih rezervacija.
    const danOpenUtc = salonWallToUtc(year, month, day, radno.open, 0);
    const danCloseUtc = salonWallToUtc(year, month, day, radno.close, 0);

    const zauzete = await prisma.rezervacija.findMany({
      where: {
        status: { in: ["NA_CEKANJU", "POTVRDJENO", "BLOKIRANO"] },
        pocetak: { lt: danCloseUtc },
        kraj: { gt: danOpenUtc },
      },
      select: { pocetak: true, kraj: true },
    });

    const slotovi: { pocetak: string; vrijeme: string }[] = [];

    // Generiši početke termina od open do (close - trajanje), korak SLOT_KORAK_MIN.
    for (
      let minute = radno.open * 60;
      minute + usluga.trajanje <= radno.close * 60;
      minute += SLOT_KORAK_MIN
    ) {
      const h = Math.floor(minute / 60);
      const m = minute % 60;
      const pocetak = salonWallToUtc(year, month, day, h, m);
      const kraj = new Date(pocetak.getTime() + trajanjeMs);

      // Preskoči termine u prošlosti / prekratko najavljene.
      if (pocetak.getTime() < najraniji) continue;

      // Slobodan ako se ne preklapa ni sa jednom zauzetom rezervacijom.
      const preklapa = zauzete.some(
        (r) => r.pocetak < kraj && pocetak < r.kraj,
      );
      if (preklapa) continue;

      slotovi.push({
        pocetak: pocetak.toISOString(),
        vrijeme: formatSalonTime(pocetak),
      });
    }

    return NextResponse.json({ slotovi, zatvoreno: false });
  } catch {
    return NextResponse.json(
      { greska: "Greška pri računanju slobodnih termina." },
      { status: 500 },
    );
  }
}
