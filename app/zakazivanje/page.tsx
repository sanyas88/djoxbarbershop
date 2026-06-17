import Link from "next/link";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Zakazivanje | Djox Barbershop",
  description: "Izaberi uslugu i termin i zakaži svoj dolazak u Djox Barbershop.",
};

export default function ZakazivanjePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-gutter">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-blood-red">
              content_cut
            </span>
            <span className="font-headline-lg text-2xl uppercase tracking-tighter text-on-background">
              DJOX <span className="text-blood-red">BARBERSHOP</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted-gray transition-colors hover:text-pure-white"
          >
            ← Početna
          </Link>
        </div>
      </header>

      <main className="px-gutter py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h4 className="font-script text-3xl text-blood-red">Zakazivanje</h4>
          <h1 className="font-headline-lg text-4xl uppercase text-pure-white sm:text-5xl">
            Rezerviši svoj termin
          </h1>
        </div>
        <BookingFlow />
      </main>
    </div>
  );
}
