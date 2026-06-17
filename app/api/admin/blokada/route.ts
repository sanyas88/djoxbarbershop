import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { ZAUZETI_STATUSI } from "@/lib/booking-config";
import { salonWallToUtc, parseDatum } from "@/lib/time";

// POST /api/admin/blokada — admin blokira termin (status BLOKIRANO, bez klijenta i mejla).
// Zaštita: samo ADMIN; korisnik-vlasnik bloka je sam admin.
export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ greska: "Nemate admin pristup." }, { status: 403 });
  }

  let body: { datum?: string; od?: string; do?: string; napomena?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ greska: "Neispravan zahtjev." }, { status: 400 });
  }

  const { datum, od, do: doVrijeme, napomena } = body;
  if (!datum || !od || !doVrijeme) {
    return NextResponse.json(
      { greska: "Nedostaje datum, početak ili kraj." },
      { status: 400 },
    );
  }

  const d = parseDatum(datum);
  const odM = /^(\d{2}):(\d{2})$/.exec(od);
  const doM = /^(\d{2}):(\d{2})$/.exec(doVrijeme);
  if (!d || !odM || !doM) {
    return NextResponse.json(
      { greska: "Neispravan format datuma ili vremena." },
      { status: 400 },
    );
  }

  const pocetak = salonWallToUtc(d.year, d.month, d.day, Number(odM[1]), Number(odM[2]));
  const kraj = salonWallToUtc(d.year, d.month, d.day, Number(doM[1]), Number(doM[2]));

  if (kraj.getTime() <= pocetak.getTime()) {
    return NextResponse.json(
      { greska: "Kraj mora biti poslije početka." },
      { status: 400 },
    );
  }

  // Ne dozvoljavamo blokiranje termina koji je već prošao.
  if (kraj.getTime() < Date.now()) {
    return NextResponse.json(
      { greska: "Ne možete blokirati termin u prošlosti." },
      { status: 400 },
    );
  }

  // Ako se preklapa sa postojećim aktivnim terminom (klijent ili drugi blok) — odbij.
  const preklapanje = await prisma.rezervacija.findFirst({
    where: {
      status: { in: [...ZAUZETI_STATUSI] },
      pocetak: { lt: kraj },
      kraj: { gt: pocetak },
    },
    select: { id: true },
  });
  if (preklapanje) {
    return NextResponse.json(
      { greska: "Taj period se preklapa sa postojećom rezervacijom ili blokadom." },
      { status: 409 },
    );
  }

  const blokada = await prisma.rezervacija.create({
    data: {
      userId: admin.id,
      uslugaId: null,
      pocetak,
      kraj,
      status: "BLOKIRANO",
      napomena: napomena?.slice(0, 500) || "Blokirano",
    },
    select: { id: true, pocetak: true, kraj: true, status: true },
  });

  // (Zapier "🚫 Zauzeto" Calendar event — bez mejla — dolazi u Fazi 7.)

  return NextResponse.json({ ok: true, blokada }, { status: 201 });
}
