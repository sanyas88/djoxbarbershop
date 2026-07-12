import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const usluge = [
  {
    naziv: "Muško šišanje",
    trajanje: 30,
    cijena: 10,
    opis: "Klasično šišanje i stilizovanje.",
  },
  {
    naziv: "Šišanje sa izbrijvavanjem",
    trajanje: 45,
    cijena: 15,
    opis: "Detaljno brijanje šejverom za savršen izgled.",
  },
  {
    naziv: "Uređivanje brade",
    trajanje: 20,
    cijena: 6,
    opis: "Oblikovanje i sređivanje brade po vašem stilu. Fade na bradi.",
  },
  {
    naziv: "Pranje kose",
    trajanje: 15,
    cijena: 5,
    opis: "Pranje kose profesionalnim šamponima.",
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
