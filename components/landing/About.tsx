function Feature({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-blood-red">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="font-accent-label text-pure-white uppercase text-sm tracking-widest">{label}</span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-headline-lg text-4xl text-blood-red">{value}</div>
      <div className="text-xs uppercase tracking-tighter text-muted-gray">{label}</div>
    </div>
  );
}

export function About() {
  return (
    <section id="o-nama" className="py-section-gap max-w-[1280px] mx-auto px-gutter">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-blood-red"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded-xl border border-border-subtle w-full h-[600px] object-cover"
            alt="Majstor berberin pri brijanju britvom uz tople peškire"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-eDpGLBoAM_BFeoP9k18MfvAG5_oBVvUMJDw_Uiqk5dbVpLSOPHsvKPocqAHu-wW9MfNtUZt_5rTkRPxO-Au4GrXcU-Bznw-R-9dN2DOw8iusO5TX_9yzrZE9e_ho-fPS95JUoDRymGhQSTcRU-A8U3uDlYOk6YhMZfG0SDHj6w4xKyTTuq65REwTSN6Kr5r0JtSlmwI4FcmAt8FebQDePaSUvEk4VUNqz6TtoEQekTnBOTWYHU0ZEgtPwvJrCqAD7QR9ZYOErm0"
          />
          <div className="absolute -bottom-10 -right-10 bg-charcoal-bg p-8 rounded-xl border border-border-subtle shadow-xl hidden md:block">
            <span className="font-script text-blood-red text-4xl">Preciznost</span>
            <p className="text-muted-gray mt-2">Iznad svega.</p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <h4 className="font-script text-blood-red text-3xl mb-2">O nama</h4>
            <h3 className="font-headline-lg text-5xl uppercase text-pure-white mb-6">
              Vaš pouzdani salon za kosu i ljepotu
            </h3>
            <p className="text-muted-gray leading-relaxed text-lg">
              U našem barbershopu vjerujemo da je dobra frizura više od puko dotjerivanja – to je izjava o samopouzdanju i stilu. Naši vješti berberi kombinuju preciznost, kreativnost i pažnju na detalje kako bi pružili rezove koji odgovaraju vašoj ličnosti i životnom stilu. Bilo da tražite klasični trim ili moderan fade, osiguravamo da svaki posjet ostavi osjećaj svježine, samopouzdanja i spremnosti za dan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 py-4">
            <Feature icon="content_cut" label="Šišanje" />
            <Feature icon="dry" label="Moderna oprema" />
            <Feature icon="sanitizer" label="Higijena" />
            <Feature icon="mood" label="Zadovoljstvo klijenta" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border-subtle">
            <Stat value="100K" label="Modernih frizura" />
            <Stat value="200K" label="Ekspert stilista" />
            <Stat value="300K" label="Higijenski salon" />
            <Stat value="400K" label="Premium proizvoda" />
          </div>
        </div>
      </div>
    </section>
  );
}
