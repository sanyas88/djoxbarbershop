import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { salonInfo } from "@/lib/landing-images";
import { Icon } from "@/components/ui/Icon";

export async function Footer() {
  const t = await getTranslations("footer");
  const h = await getTranslations("hours");

  return (
    <footer className="bg-surface-container-lowest border-t border-border-subtle pt-section-gap pb-10">
      <div className="max-w-[1280px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="content_cut" className="text-blood-red text-3xl" />
            <h1 className="font-headline-lg text-3xl tracking-tighter uppercase text-on-background">
              DJOX <span className="text-blood-red">BARBER</span>
            </h1>
          </div>
          <p className="text-muted-gray mb-4">{salonInfo.slogan}</p>
          <p className="text-muted-gray text-sm mb-2">{salonInfo.adresa}</p>
          <a
            href={salonInfo.telefonLink}
            className="text-muted-gray text-sm mb-8 inline-block hover:text-blood-red transition-colors"
          >
            {salonInfo.telefon}
          </a>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-muted-gray hover:text-blood-red hover:bg-surface-container transition-all"
              href={salonInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Icon name="photo_camera" className="text-xl" />
            </a>
            <a
              className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-muted-gray hover:text-blood-red hover:bg-surface-container transition-all"
              href={salonInfo.telefonLink}
              aria-label="Phone"
            >
              <Icon name="call" className="text-xl" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-accent-label text-pure-white uppercase text-sm tracking-widest mb-8 border-b border-blood-red/30 pb-2 inline-block">
            {t("menu")}
          </h4>
          <ul className="flex flex-col gap-4 text-muted-gray">
            <li><a className="hover:text-blood-red transition-colors" href="#pocetna">{t("links.home")}</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#usluge">{t("links.services")}</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#galerija">{t("links.gallery")}</a></li>
            <li><a className="hover:text-blood-red transition-colors" href="#rezervacija">{t("links.contact")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-accent-label text-pure-white uppercase text-sm tracking-widest mb-8 border-b border-blood-red/30 pb-2 inline-block">
            {t("hours")}
          </h4>
          <ul className="flex flex-col gap-4 text-muted-gray text-sm">
            {salonInfo.radnoVrijemeStavke.map((s) => (
              <li key={s.hourKey} className="flex justify-between gap-4">
                <span>{h(s.hourKey)}</span>
                <span
                  className={
                    "zatvoreno" in s && s.zatvoreno
                      ? "text-blood-red font-bold"
                      : "text-pure-white"
                  }
                >
                  {"zatvoreno" in s && s.zatvoreno ? h("closed") : s.vrijeme}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-accent-label text-pure-white uppercase text-sm tracking-widest mb-8 border-b border-blood-red/30 pb-2 inline-block">
            {t("contactTitle")}
          </h4>
          <p className="text-muted-gray text-sm mb-6">{t("contactText")}</p>
          <Link
            href="/zakazivanje"
            className="inline-block rounded-lg bg-blood-red px-5 py-3 text-xs font-bold uppercase tracking-widest text-pure-white transition-all hover:brightness-110"
          >
            {t("bookCta")}
          </Link>
        </div>
      </div>
      <div className="border-t border-border-subtle pt-10 text-center max-w-[1280px] mx-auto px-gutter">
        <p className="text-muted-gray text-xs uppercase tracking-widest">
          {t("copyright")} |{" "}
          <Link
            href="/privatnost"
            className="hover:text-pure-white underline decoration-blood-red underline-offset-4"
          >
            {t("privacy")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
