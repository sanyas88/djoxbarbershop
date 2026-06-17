export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-border-subtle pt-section-gap pb-10">
      <div className="max-w-[1280px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-blood-red text-3xl">content_cut</span>
            <h1 className="font-headline-lg text-3xl tracking-tighter uppercase text-on-background">
              DJOX <span className="text-blood-red">BARBER</span>
            </h1>
          </div>
          <p className="text-muted-gray mb-8">
            Vaš omiljeni barbershop u srcu Crne Gore. Kvalitet, stil i preciznost su naša obećanja.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-muted-gray hover:text-blood-red hover:bg-surface-container transition-all"
              href="#"
              aria-label="Facebook"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
            <a
              className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-muted-gray hover:text-blood-red hover:bg-surface-container transition-all"
              href="#"
              aria-label="Email"
            >
              <span className="material-symbols-outlined text-xl">alternate_email</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-accent-label text-pure-white uppercase text-sm tracking-widest mb-8 border-b border-blood-red/30 pb-2 inline-block">
            Meni
          </h4>
          <ul className="flex flex-col gap-4 text-muted-gray">
            <li><a className="hover:text-blood-red transition-colors" href="#pocetna">Početna</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#usluge">Naše usluge</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#galerija">Galerija radova</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#tim">Naš tim stručnjaka</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#rezervacija">Kontakt informacije</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-accent-label text-pure-white uppercase text-sm tracking-widest mb-8 border-b border-blood-red/30 pb-2 inline-block">
            Radno Vrijeme
          </h4>
          <ul className="flex flex-col gap-4 text-muted-gray text-sm">
            <li className="flex justify-between"><span>Pon - Pet:</span> <span className="text-pure-white">09:00 - 21:00</span></li>
            <li className="flex justify-between"><span>Subota:</span> <span className="text-pure-white">09:00 - 18:00</span></li>
            <li className="flex justify-between"><span>Nedjelja:</span> <span className="text-blood-red font-bold">Zatvoreno</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-accent-label text-pure-white uppercase text-sm tracking-widest mb-8 border-b border-blood-red/30 pb-2 inline-block">
            Newsletter
          </h4>
          <p className="text-muted-gray text-sm mb-6">
            Prijavite se za savjete o stilizovanju i ekskluzivne ponude.
          </p>
          <div className="relative">
            <input
              className="w-full bg-surface-container-high border border-border-subtle rounded-lg py-3 px-4 text-sm focus:ring-blood-red focus:border-blood-red outline-none"
              placeholder="Email adresa"
              type="email"
            />
            <button className="absolute right-2 top-1.5 bg-blood-red text-pure-white px-3 py-1.5 rounded-md text-xs font-bold uppercase hover:brightness-110">
              Prijavi se
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-border-subtle pt-10 text-center max-w-[1280px] mx-auto px-gutter">
        <p className="text-muted-gray text-xs uppercase tracking-widest">
          © 2024 DJOX BARBERSHOP. Sva prava zadržana. |{" "}
          <a className="hover:text-pure-white underline decoration-blood-red underline-offset-4" href="#">
            Pravila privatnosti
          </a>
        </p>
      </div>
    </footer>
  );
}
