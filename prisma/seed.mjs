import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const usluge = [
  {
    naziv: "Šišanje i stilizovanje",
    trajanje: 45,
    cijena: 15,
    opis: "Čisti, precizni rezovi prilagođeni vašem stilu i ličnosti. Naša specijalnost su moderni fade rezovi.",
  },
  {
    naziv: "Brijanje i brada",
    trajanje: 30,
    cijena: 12,
    opis: "Tradicionalno brijanje britvom uz vruće peškire. Oblikovanje brade za uglađen i moderan izgled.",
  },
  {
    naziv: "Full Paket (šišanje + brijanje)",
    trajanje: 75,
    cijena: 25,
    opis: "Kompletan tretman — šišanje, stilizovanje i oblikovanje brade u jednom terminu.",
  },
  {
    naziv: "Farbanje kose",
    trajanje: 90,
    cijena: 35,
    opis: "Profesionalno bojenje kose za odvažan i osvježen stil. Koristimo samo vrhunske preparate.",
  },
];

async function main() {
  await prisma.usluga.deleteMany();
  await prisma.usluga.createMany({ data: usluge });
  console.log(`Seed gotov: ${usluge.length} usluga upisano.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
