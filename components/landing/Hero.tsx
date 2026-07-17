import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { landingImages } from "@/lib/landing-images";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      id="pocetna"
      className="relative min-h-[min(92vh,860px)] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src={landingImages.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] md:object-[right_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background from-35% via-background/85 via-50% to-background/20 md:from-30% md:via-45% md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30 md:from-background/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-gutter py-20 md:py-28">
        <div className="max-w-xl md:max-w-2xl">
          <h2 className="font-headline-lg text-6xl uppercase leading-[0.9] tracking-tighter text-pure-white sm:text-7xl md:text-8xl">
            {t("title1")} <br /> <span className="text-blood-red">{t("title2")}</span>,<br /> {t("title3")}
          </h2>
          <p className="mt-8 max-w-md text-lg text-muted-gray">{t("subtitle")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/zakazivanje"
              className="bg-blood-red text-pure-white font-button-text rounded-lg px-10 py-4 text-sm uppercase tracking-widest shadow-lg shadow-blood-red/20 transition-transform hover:scale-105"
            >
              {t("book")}
            </Link>
            <a
              href="#usluge"
              className="border border-pure-white text-pure-white font-button-text rounded-lg px-10 py-4 text-sm uppercase tracking-widest transition-all hover:bg-pure-white/10"
            >
              {t("explore")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
