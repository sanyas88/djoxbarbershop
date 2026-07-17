import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { landingImages } from "@/lib/landing-images";
import { Icon } from "@/components/ui/Icon";

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
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 850px"
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      {withOverlay && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Icon name="visibility" className="text-pure-white text-4xl" />
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
