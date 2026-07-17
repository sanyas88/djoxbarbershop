import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { Icon } from "@/components/ui/Icon";

export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="fixed top-0 z-50 h-16 w-full border-b border-border-subtle bg-background/95 shadow-sm backdrop-blur-md md:h-20">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-3 px-gutter">
        <Link href="/" className="flex min-w-0 items-center gap-1.5 md:gap-2">
          <Icon name="content_cut" className="shrink-0 text-2xl text-blood-red md:text-3xl" />
          <span className="font-headline-lg text-[1.35rem] uppercase leading-none tracking-tighter text-on-background sm:text-2xl md:text-3xl">
            DJOX <span className="text-blood-red">BARBERSHOP</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            className="font-bold text-blood-red transition-colors duration-300 hover:text-blood-red"
            href="#pocetna"
          >
            {t("home")}
          </a>
          <a
            className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
            href="#o-nama"
          >
            {t("about")}
          </a>
          <a
            className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
            href="#usluge"
          >
            {t("services")}
          </a>
          <a
            className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
            href="#lokacije"
          >
            {t("location")}
          </a>
          <a
            className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red"
            href="#galerija"
          >
            {t("gallery")}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <Link
            href="/zakazivanje"
            className="hidden rounded-lg bg-blood-red px-6 py-3 font-button-text text-sm uppercase tracking-widest text-pure-white transition-all hover:brightness-110 active:scale-95 md:inline-flex"
          >
            {t("bookShort")}
          </Link>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
