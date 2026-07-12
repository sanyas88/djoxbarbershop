import { getTranslations } from "next-intl/server";

function BrandItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-primary font-headline-lg text-2xl uppercase">
      <span className="material-symbols-outlined">{icon}</span> {label}
    </div>
  );
}

export async function BrandBar() {
  const t = await getTranslations("brandBar");

  return (
    <section className="bg-surface-container-lowest py-10 border-y border-border-subtle overflow-hidden">
      <div className="flex gap-20 animate-[scroll_30s_linear_infinite] whitespace-nowrap opacity-30 items-center">
        <BrandItem icon="brush" label={t("classicCut")} />
        <BrandItem icon="content_cut" label={t("urbanFades")} />
        <BrandItem icon="face" label={t("beardKings")} />
        <BrandItem icon="star" label={t("precision")} />
        <BrandItem icon="brush" label={t("classicCut")} />
        <BrandItem icon="content_cut" label={t("urbanFades")} />
        <BrandItem icon="face" label={t("beardKings")} />
      </div>
    </section>
  );
}
