import Link from "next/link";

function ServiceCard({
  src,
  alt,
  title,
  description,
}: {
  src: string;
  alt: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-surface-container rounded-2xl overflow-hidden border border-border-subtle hover:border-blood-red/50 transition-all group">
      <div className="relative h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={alt}
          src={src}
        />
        <div className="absolute inset-0 image-gradient-overlay"></div>
      </div>
      <div className="p-8">
        <h3 className="font-headline-lg text-2xl uppercase mb-4 text-pure-white">{title}</h3>
        <p className="text-muted-gray mb-8 text-sm">{description}</p>
        <Link
          href="/zakazivanje"
          className="block text-center w-full border border-blood-red text-blood-red py-3 rounded-lg font-button-text uppercase tracking-widest text-xs hover:bg-blood-red hover:text-pure-white transition-all"
        >
          Zakaži termin
        </Link>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="usluge" className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="text-center mb-16">
          <h4 className="font-script text-blood-red text-3xl">Naše usluge</h4>
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">
            Vrhunsko dotjerivanje po vašoj mjeri
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdH4U2VdwB4EeDQek5zgcCkqaGw7MsHCZFRyAYLWkVRpNJ1tGLmQ1iA33_hEK1lqKCCmypwz3hdWTbcjdkMQP9NdliRbLXy8yBt68ihzDcr6neRqiV5lMjLjNNaethPQ7DTczk1Kimb4kb_27yrvxJCwi0p5KJLoU967iCDKBohQ1OEst9SRetb_JwxDigor3YuCDo1w3sZEQ8Ykar6deXVetVzvQDkaGYZvfuz-7mABWaqUrgkhXDHNoeT1XgaSBRD2aruqA27Nk"
            alt="Precizan fade rez u tamnom ambijentu"
            title="Šišanje i stilizovanje"
            description="Čisti, precizni rezovi prilagođeni vašem stilu i ličnosti. Naša specijalnost su moderni fade rezovi."
          />
          <ServiceCard
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlUjdWyPY49xKB7RbalfQ1yGjoHn39og1wjq_K3F73_dcJztx0e8s4OooKsOOf9hvbJzQHpXHZMOVeEgK8fGqOEBzzrobq1N7xWwDa1B71gz6UL1jM8LC8KC2iLTKs-8Thmbv-YKN42vw0WkxPp69LdID_uQb15PixTmxU79yGJ5ByUEM3XgQe6pHuKvVYjmB21p3_9nRHJEhwTVF1QgILhKy2WYsc29-pCYEZzWim5prIfG6i9gLI1r-GyZUT4nMVM3_z_zPhaZg"
            alt="Luksuzno oblikovanje brade uz vruće peškire"
            title="Brijanje i brada"
            description="Tradicionalno brijanje britvom uz vruće peškire. Oblikovanje brade za uglađen i moderan izgled."
          />
          <ServiceCard
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQnhR-oKgOF1xgOBY3Vc3vaj4XzK0tD9TxiqvT6qQi1AxjlK8m8MgU0-9Y4EDns9vjrklFsg-kdYzVjwmCshF7qAONDk5p98lRKihTof74ph1mOeej2ya3sT0TibAAhQcYOvv23lBcjiWWpELnsNPP9QbopiPj3G-0pzZQCDUFKdCWAvUSS3jEFAjgGi5gMqWeqDk0vSW7XoMDbgqR8O40CdaN8yQRkZA03zhTx6DHMuVju2Tev7LkSYkNSaXR1P45lu-pUmaO_ks"
            alt="Profesionalno farbanje kose"
            title="Farbanje kose"
            description="Profesionalno bojenje kose za odvažan i osvježen stil. Koristimo samo vrhunske preparate."
          />
        </div>
      </div>
    </section>
  );
}
