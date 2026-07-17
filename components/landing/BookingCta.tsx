import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { landingImages, salonInfo } from "@/lib/landing-images";

export async function BookingCta() {
  const t = await getTranslations("bookingCta");
  const common = await getTranslations("common");

  return (
    <section id="rezervacija" className="py-section-gap relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover opacity-20 grayscale"
          alt={t("bgAlt")}
          src={landingImages.bookingBg}
        />
      </div>
      <div className="max-w-3xl mx-auto px-gutter relative z-10 text-center">
        <div className="bg-charcoal-bg/80 backdrop-blur-xl border border-border-subtle p-10 md:p-16 rounded-3xl shadow-2xl">
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">{t("title")}</h2>
          <p className="text-muted-gray mt-4 max-w-xl mx-auto">
            {t("subtitle", {
              phone: salonInfo.telefon,
              payment: common("cashOnly"),
            })}
          </p>
          <Link
            href="/zakazivanje"
            className="mt-10 inline-block w-full sm:w-auto min-w-[280px] bg-blood-red text-pure-white font-button-text py-5 px-12 rounded-lg uppercase tracking-[0.2em] text-lg shadow-xl shadow-blood-red/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {t("submit")}
          </Link>
        </div>
      </div>
    </section>
  );
}
