import Link from "next/link";

export function BookingCta() {
  return (
    <section id="rezervacija" className="py-section-gap relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Atmosferičan enterijer salona"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVc_109u-PU2Lg0ryCNFjv5Pys2h196s1BbTysRdf8yrD2JbNpnYvd2QufTbmZczKYGblHfyquc33imZ58HnXX9C_52mnZWu-qF2H7OkmY-XrgDyj8QgoeTfEcvTEf3d9C5_yY59xA9Ew-gvV8ue9BsBnLa3pxUwrlPdge73bU-NIC1iPi46Qc2lStKM8HgzuA1mR4WanzcuPg-bJXS2AAAa2YzZT1GDw7ID1ZfNPEumZ_dZYuC3gGYE-77GQtnOz7nASmFU3slSk"
        />
      </div>
      <div className="max-w-4xl mx-auto px-gutter relative z-10">
        <div className="bg-charcoal-bg/80 backdrop-blur-xl border border-border-subtle p-10 md:p-16 rounded-3xl shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-5xl uppercase text-pure-white">Zakaži termin</h2>
            <p className="text-muted-gray mt-4">
              Rezervišite svoje mjesto i preskočite čekanje – vaš svježi izgled je samo jedan klik daleko.
            </p>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">Vaše Ime</label>
              <input
                className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all"
                placeholder="Petar Petrović"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">Broj Telefona</label>
              <input
                className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all"
                placeholder="+382 6X XXX XXX"
                type="tel"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">Vrsta Usluge</label>
              <select className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all">
                <option>Šišanje</option>
                <option>Brijanje</option>
                <option>Full Paket</option>
                <option>Farbanje</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">Datum i Vrijeme</label>
              <input
                className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all"
                type="datetime-local"
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <Link
                href="/zakazivanje"
                className="block w-full text-center bg-blood-red text-pure-white font-button-text py-5 rounded-lg uppercase tracking-[0.2em] text-lg shadow-xl shadow-blood-red/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Rezerviši odmah
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
