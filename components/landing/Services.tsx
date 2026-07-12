import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { salonUsluge } from "@/lib/salon-usluge";

function ServiceCard({
  src,
  alt,
  title,
  price,
  description,
  bookLabel,
}: {
  src: string;
  alt: string;
  title: string;
  price: string;
  description: string;
  bookLabel: string;
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
        <span className="absolute top-4 right-4 rounded-lg bg-blood-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-pure-white">
          {price}
        </span>
      </div>
      <div className="p-8">
        <h3 className="font-headline-lg text-2xl uppercase mb-3 text-pure-white">{title}</h3>
        <p className="text-muted-gray mb-8 text-sm">{description}</p>
        <Link
          href="/zakazivanje"
          className="block text-center w-full border border-blood-red text-blood-red py-3 rounded-lg font-button-text uppercase tracking-widest text-xs hover:bg-blood-red hover:text-pure-white transition-all"
        >
          {bookLabel}
        </Link>
      </div>
    </div>
  );
}

export async function Services() {
  const t = await getTranslations("services");

  return (
    <section id="usluge" className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="text-center mb-16">
          <h4 className="font-script text-blood-red text-3xl">{t("label")}</h4>
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {salonUsluge.map((u) => (
            <ServiceCard
              key={u.key}
              src={u.slika}
              alt={t(`${u.key}.alt`)}
              title={t(`${u.key}.name`)}
              price={u.cijenaPrikaz}
              description={t(`${u.key}.desc`)}
              bookLabel={t("book")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
