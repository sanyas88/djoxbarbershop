import { getTranslations } from "next-intl/server";
import { salonInfo, salonMapa } from "@/lib/landing-images";
import { Icon } from "@/components/ui/Icon";

export async function Locations() {
  const t = await getTranslations("locations");
  const h = await getTranslations("hours");

  return (
    <section id="lokacije" className="py-section-gap">
      <div className="mx-auto max-w-[1280px] px-gutter">
        <div className="mb-12">
          <h4 className="font-script text-3xl text-blood-red">{t("label")}</h4>
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">{t("title")}</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:items-stretch">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border-subtle lg:col-span-3 lg:min-h-[420px]">
            <div className="absolute inset-0">
              <iframe
                title={`Mapa — ${salonInfo.naziv}`}
                src={salonMapa.embedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-container p-8 lg:col-span-2">
            <div>
              <h3 className="font-headline-lg mb-3 text-2xl uppercase text-pure-white">
                {salonInfo.naziv}
              </h3>
              <p className="mb-4 flex items-start gap-2 text-sm text-muted-gray">
                <Icon name="call" className="mt-0.5 shrink-0 text-base text-blood-red" />
                <a href={salonInfo.telefonLink} className="hover:text-blood-red transition-colors">
                  {salonInfo.telefon}
                </a>
              </p>
              <p className="mb-6 flex items-start gap-2 text-sm text-muted-gray">
                <Icon name="location_on" className="mt-0.5 shrink-0 text-base text-blood-red" />
                {salonInfo.adresa}
              </p>
              <ul className="mb-8 flex flex-col gap-3 text-sm text-muted-gray">
                {salonInfo.radnoVrijemeStavke.map((s) => (
                  <li key={s.hourKey} className="flex justify-between gap-4">
                    <span>{h(s.hourKey)}</span>
                    <span
                      className={
                        "zatvoreno" in s && s.zatvoreno
                          ? "font-bold text-blood-red"
                          : "text-pure-white"
                      }
                    >
                      {"zatvoreno" in s && s.zatvoreno ? h("closed") : s.vrijeme}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={salonMapa.otvoriUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blood-red/40 bg-blood-red/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-pure-white transition-colors hover:bg-blood-red hover:text-pure-white"
            >
              <Icon name="directions" className="text-base" />
              {t("openMaps")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
