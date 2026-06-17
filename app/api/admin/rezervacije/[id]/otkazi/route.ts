import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

// POST /api/admin/rezervacije/[id]/otkazi — admin otkazuje BILO KOJU rezervaciju
// ili uklanja blokadu (status -> OTKAZANO, čime se slot oslobađa).
// Zaštita: samo ADMIN.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ greska: "Nemate admin pristup." }, { status: 403 });
  }

  const rez = await prisma.rezervacija.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!rez) {
    return NextResponse.json({ greska: "Termin ne postoji." }, { status: 404 });
  }

  if (rez.status === "OTKAZANO") {
    return NextResponse.json({ greska: "Termin je već otkazan." }, { status: 400 });
  }

  await prisma.rezervacija.update({
    where: { id: rez.id },
    data: { status: "OTKAZANO" },
  });

  return NextResponse.json({ ok: true });
}
