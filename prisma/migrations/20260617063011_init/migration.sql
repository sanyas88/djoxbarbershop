-- CreateEnum
CREATE TYPE "Uloga" AS ENUM ('ADMIN', 'KLIJENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NA_CEKANJU', 'POTVRDJENO', 'OTKAZANO', 'BLOKIRANO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "uloga" "Uloga" NOT NULL DEFAULT 'KLIJENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usluge" (
    "id" TEXT NOT NULL,
    "naziv" TEXT NOT NULL,
    "trajanje" INTEGER NOT NULL,
    "cijena" DECIMAL(10,2) NOT NULL,
    "opis" TEXT,
    "aktivna" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usluge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rezervacije" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uslugaId" TEXT,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NA_CEKANJU',
    "napomena" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rezervacije_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "rezervacije_pocetak_kraj_idx" ON "rezervacije"("pocetak", "kraj");

-- CreateIndex
CREATE INDEX "rezervacije_userId_idx" ON "rezervacije"("userId");

-- CreateIndex
CREATE INDEX "rezervacije_status_idx" ON "rezervacije"("status");

-- AddForeignKey
ALTER TABLE "rezervacije" ADD CONSTRAINT "rezervacije_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rezervacije" ADD CONSTRAINT "rezervacije_uslugaId_fkey" FOREIGN KEY ("uslugaId") REFERENCES "usluge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
