import { getTranslations } from "next-intl/server";
import { landingImages } from "@/lib/landing-images";

function GalleryItem({
  src,
  alt,
  className,
  withOverlay,
}: {
  src: string;
  alt: string;
  className: string;
  withOverlay?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-border-subtle group relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        alt={alt}
        src={src}
      />
      {withOverlay && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="material-symbols-outlined text-pure-white text-4xl">visibility</span>
        </div>
      )}
    </div>
  );
}

export async function Gallery() {
  const t = await getTranslations("gallery");

  return (
    <section id="galerija" className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="text-center mb-16">
          <h4 className="font-script text-blood-red text-3xl">{t("label")}</h4>
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">{t("title")}</h2>
        </div>
        <div className="bento-grid">
          <GalleryItem
            className="col-span-12 md:col-span-8 h-[500px]"
            withOverlay
            alt={t("mainAlt")}
            src={landingImages.gallery.main}
          />
          <GalleryItem
            className="col-span-6 md:col-span-4 h-[500px]"
            alt={t("toolsAlt")}
            src={landingImages.gallery.alat}
          />
          <GalleryItem
            className="col-span-6 md:col-span-4 h-[400px]"
            alt={t("shaveAlt")}
            src={landingImages.gallery.brijanje}
          />
          <GalleryItem
            className="col-span-12 md:col-span-8 h-[400px]"
            alt={t("interiorAlt")}
            src={landingImages.gallery.salon}
          />
        </div>
      </div>
    </section>
  );
}
