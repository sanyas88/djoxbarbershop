import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { landingImages, salonInfo } from "@/lib/landing-images";
import { salonUsluge } from "@/lib/salon-usluge";

export async function BookingCta() {
  const t = await getTranslations("bookingCta");
  const common = await getTranslations("common");
  const services = await getTranslations("services");

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
      <div className="max-w-4xl mx-auto px-gutter relative z-10">
        <div className="bg-charcoal-bg/80 backdrop-blur-xl border border-border-subtle p-10 md:p-16 rounded-3xl shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-5xl uppercase text-pure-white">{t("title")}</h2>
            <p className="text-muted-gray mt-4">
              {t("subtitle", {
                phone: salonInfo.telefon,
                payment: common("cashOnly"),
              })}
            </p>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">{t("name")}</label>
              <input
                className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all"
                placeholder="Petar Petrović"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">{t("phone")}</label>
              <input
                className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all"
                placeholder={salonInfo.telefon}
                type="tel"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">{t("service")}</label>
              <select className="bg-surface-container-high border border-border-subtle rounded-lg py-4 px-6 text-on-background focus:ring-blood-red focus:border-blood-red transition-all">
                {salonUsluge.map((u) => (
                  <option key={u.key}>{services(`${u.key}.name`)}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-muted-gray font-bold">{t("datetime")}</label>
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
                {t("submit")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
