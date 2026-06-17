function BrandItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-primary font-headline-lg text-2xl uppercase">
      <span className="material-symbols-outlined">{icon}</span> {label}
    </div>
  );
}

export function BrandBar() {
  return (
    <section className="bg-surface-container-lowest py-10 border-y border-border-subtle overflow-hidden">
      <div className="flex gap-20 animate-[scroll_30s_linear_infinite] whitespace-nowrap opacity-30 items-center">
        <BrandItem icon="brush" label="Classic Cut" />
        <BrandItem icon="content_cut" label="Urban Fades" />
        <BrandItem icon="face" label="Beard Kings" />
        <BrandItem icon="palette" label="Color Master" />
        <BrandItem icon="brush" label="Classic Cut" />
        <BrandItem icon="content_cut" label="Urban Fades" />
        <BrandItem icon="face" label="Beard Kings" />
      </div>
    </section>
  );
}
