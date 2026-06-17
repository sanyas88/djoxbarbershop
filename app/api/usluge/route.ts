import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/usluge — vraća sve aktivne usluge (javno, za izbor pri zakazivanju).
export async function GET() {
  try {
    const usluge = await prisma.usluga.findMany({
      where: { aktivna: true },
      orderBy: { cijena: "asc" },
      select: {
        id: true,
        naziv: true,
        trajanje: true,
        cijena: true,
        opis: true,
      },
    });

    return NextResponse.json(
      usluge.map((u) => ({
        ...u,
        cijena: Number(u.cijena),
      })),
    );
  } catch {
    return NextResponse.json(
      { greska: "Greška pri učitavanju usluga." },
      { status: 500 },
    );
  }
}
