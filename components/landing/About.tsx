import { getTranslations } from "next-intl/server";
import { landingImages, salonInfo } from "@/lib/landing-images";

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

export async function About() {
  const t = await getTranslations("about");

  return (
    <section id="o-nama" className="py-section-gap max-w-[1280px] mx-auto px-gutter">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-blood-red"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded-xl border border-border-subtle w-full h-[600px] object-cover"
            alt={t("imageAlt")}
            src={landingImages.about}
          />
          <div className="absolute -bottom-10 -right-10 bg-charcoal-bg p-8 rounded-xl border border-border-subtle shadow-xl hidden md:block">
            <span className="font-script text-blood-red text-4xl">{t("cardTitle")}</span>
            <p className="text-muted-gray mt-2">{salonInfo.slogan}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <h4 className="font-script text-blood-red text-3xl mb-2">{t("label")}</h4>
            <h3 className="font-headline-lg text-5xl uppercase text-pure-white mb-6">{t("title")}</h3>
            <p className="text-muted-gray leading-relaxed text-lg">{t("text")}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 py-4">
            <Feature icon="content_cut" label={t("features.cut")} />
            <Feature icon="dry" label={t("features.equipment")} />
            <Feature icon="sanitizer" label={t("features.hygiene")} />
            <Feature icon="mood" label={t("features.satisfaction")} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border-subtle">
            <Stat value="1" label={t("stats.barber")} />
            <Stat value="4" label={t("stats.services")} />
            <Stat value="100%" label={t("stats.hygiene")} />
            <Stat value="KM" label={t("stats.prices")} />
          </div>
        </div>
      </div>
    </section>
  );
}
