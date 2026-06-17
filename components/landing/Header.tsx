import Link from "next/link";
import { HeaderAuth } from "@/components/auth/HeaderAuth";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border-subtle shadow-sm h-20">
      <div className="flex justify-between items-center h-full px-gutter max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blood-red text-3xl">content_cut</span>
          <h1 className="font-headline-lg text-3xl tracking-tighter uppercase text-on-background">
            DJOX <span className="text-blood-red">BARBERSHOP</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-blood-red font-bold hover:text-blood-red transition-colors duration-300" href="#pocetna">Početna</a>
          <a className="text-muted-gray font-medium hover:text-blood-red transition-colors duration-300" href="#o-nama">O nama</a>
          <a className="text-muted-gray font-medium hover:text-blood-red transition-colors duration-300" href="#usluge">Usluge</a>
          <a className="text-muted-gray font-medium hover:text-blood-red transition-colors duration-300" href="#lokacije">Lokacije</a>
          <a className="text-muted-gray font-medium hover:text-blood-red transition-colors duration-300" href="#galerija">Galerija</a>
          <a className="text-muted-gray font-medium hover:text-blood-red transition-colors duration-300" href="#tim">Tim</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/zakazivanje"
            className="bg-blood-red text-pure-white font-button-text px-6 py-3 rounded-lg uppercase tracking-widest text-sm hover:brightness-110 transition-all active:scale-95"
          >
            ZAKAŽI TERMIN
          </Link>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
