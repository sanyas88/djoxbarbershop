import Link from "next/link";

export function Hero() {
  return (
    <section id="pocetna" className="relative min-h-[795px] flex items-center overflow-hidden">
      <div className="max-w-[1280px] mx-auto w-full px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-12 z-10">
        <div className="flex flex-col gap-8">
          <h2 className="font-headline-lg text-7xl md:text-8xl uppercase leading-[0.9] tracking-tighter text-pure-white">
            Klesanje <br /> <span className="text-blood-red">samopouzdanja</span>,<br /> rez po rez
          </h2>
          <p className="text-muted-gray text-lg max-w-md">
            Iskusite preciznost dotjerivanja i moderne stilove skrojene da podignu vaše samopouzdanje svakog dana u samom srcu grada.
          </p>
          <div className="flex gap-4">
            <Link
              href="/zakazivanje"
              className="bg-blood-red text-pure-white font-button-text px-10 py-4 rounded-lg uppercase tracking-widest text-sm shadow-lg shadow-blood-red/20 hover:scale-105 transition-transform"
            >
              Zakaži termin
            </Link>
            <a
              href="#usluge"
              className="border border-pure-white text-pure-white font-button-text px-10 py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-pure-white/10 transition-all"
            >
              Istraži
            </a>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-blood-red/10 blur-3xl rounded-full"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded-2xl border border-border-subtle shadow-2xl relative z-10 w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            alt="Berberin radi precizno šišanje u premium ambijentu"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeXmil8A8qJVjoJHnnSJEB2goNYjAinjUoy13TRH3vjKbMNhAtqfTxZ0iR6yN8nprW0frCwus6JeFeVI-dMTfiUYVgCXux49-PP2CluBrtyD-55ceaEOrkltP1i6C_IZnPZ4cGZGKKZWrJAjQQ5VRLOkH92C66O97GTcAnbEHcjOlPnIj9QZ-us7I0-HneXHZHfEnLc6oyqHK6kDEj26bnwKkn6z63KHegjPyRBtttNrMADk59giA-NALjADYmf1mdti1j3TGOmQc"
          />
        </div>
      </div>
    </section>
  );
}
