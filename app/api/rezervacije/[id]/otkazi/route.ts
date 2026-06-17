import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

// POST /api/rezervacije/[id]/otkazi — klijent otkazuje SVOJ termin.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Mora biti prijavljen.
  const user = await getOrCreateUser();
  if (!user) {
    return NextResponse.json({ greska: "Niste prijavljeni." }, { status: 401 });
  }

  const rez = await prisma.rezervacija.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true, pocetak: true },
  });
  if (!rez) {
    return NextResponse.json({ greska: "Termin ne postoji." }, { status: 404 });
  }

  // Klijent smije otkazati ISKLJUČIVO svoj termin.
  if (rez.userId !== user.id) {
    return NextResponse.json(
      { greska: "Nemate pristup ovom terminu." },
      { status: 403 },
    );
  }

  // Otkazati se mogu samo aktivni termini.
  if (rez.status !== "POTVRDJENO" && rez.status !== "NA_CEKANJU") {
    return NextResponse.json(
      { greska: "Termin se ne može otkazati." },
      { status: 400 },
    );
  }

  // Prošli termini se ne otkazuju.
  if (rez.pocetak.getTime() < Date.now()) {
    return NextResponse.json(
      { greska: "Termin je već prošao." },
      { status: 400 },
    );
  }

  await prisma.rezervacija.update({
    where: { id: rez.id },
    data: { status: "OTKAZANO" },
  });

  // (Otkazani termin automatski oslobađa slot — slotovi se računaju iz baze.)

  return NextResponse.json({ ok: true });
}
