function TeamMember({
  src,
  alt,
  name,
  role,
}: {
  src: string;
  alt: string;
  name: string;
  role: string;
}) {
  return (
    <div className="text-center group">
      <div className="relative mb-6 rounded-2xl overflow-hidden border border-border-subtle aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          alt={alt}
          src={src}
        />
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform bg-blood-red/90 flex justify-center gap-4">
          <span className="material-symbols-outlined text-pure-white cursor-pointer hover:scale-125">share</span>
          <span className="material-symbols-outlined text-pure-white cursor-pointer hover:scale-125">star</span>
        </div>
      </div>
      <h3 className="font-headline-lg text-2xl uppercase text-pure-white">{name}</h3>
      <p className="font-script text-blood-red text-xl">{role}</p>
    </div>
  );
}

export function Team() {
  return (
    <section id="tim" className="py-section-gap max-w-[1280px] mx-auto px-gutter">
      <div className="text-center mb-16">
        <h4 className="font-script text-blood-red text-3xl">Naš tim</h4>
        <h2 className="font-headline-lg text-5xl uppercase text-pure-white">Upoznajte stručnjake</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <TeamMember
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6HmDFp0Uhe9ROhZjGynSoDCf_CDJBwJ0Fooc5RQhOrZ4LJa5Lu_9JoLCOnKQTiMLlX4iviVmGgblk9i7fDSZuUUiAYaxs27qJGqZvQTXcKHplqt7vieWd5Y4wawJmupUrhCqolFFFOs4MSVUl0ktRfWJbY9BprLM6DRCBY9ost5TqLgWEY6yDh1uviSVhRVLWHbuvN3-dQ0hADNnroMTtSrmbQcE_bRztTmJQrLT6Oh6NPTQOeK96DPPVycsbRuuFZmZ_iH1JRuY"
          alt="Glavni berberin"
          name="Alex Marth"
          role="Glavni berberin"
        />
        <TeamMember
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz_OUDLyX7UWq9o1ylUSKFPh-HQ8EtOdoyG4F1W6iBwBReLX4mw-kAKD6qpWPiwBVJoy_S58H4YjU7qWCV3iqofN9_SRQcvL9jx5ZNKT8L8c97spi-YKijWmqcl1ku5WBlPdaGSp0p-5UrjyI0QvY5a-zGv-Kk8KI0Te6XqUrXgUSh0Spn5UXVdpK5EtdB6qGm6nSmVcPnN2vlLFk3hoh565DfGjXoRD3tMWVVvS1_Lr4EY6XCyswZHCpu-cBVKb9pFeDmq-u6H7c"
          alt="Senior stilista"
          name="Riyan Walker"
          role="Senior stilista"
        />
        <TeamMember
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUy2bSRvy7p-Irv7A2lXDEJ9O2GYcD5UUflBu11PKBQrbKIOjFp3tAxULMwugfTJGmZD_b0sOBkweJizZtlhQX4bWyvkGfziJm4ScxuWuCai4QRxzZ4jWzoQ9Xn5IpPVQLy6rbV-ASRjn0wHuTy6Ah49rTdVGrOarrn5E3kJO7ThIVghhYNEH8GdeXbHd_SZRW97_Jh2TOAGoBYhUoP3077ewoIQWaWNs50_Nn5mcVC2iJ3zLSvH9JZAkDi3S0hcdFjklQLZTKtRc"
          alt="Stručnjak za bradu"
          name="Daniel Brooks"
          role="Stručnjak za bradu"
        />
      </div>
    </section>
  );
}
