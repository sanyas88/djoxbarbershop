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

export function Gallery() {
  return (
    <section id="galerija" className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="text-center mb-16">
          <h4 className="font-script text-blood-red text-3xl">Galerija</h4>
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">Naši najnoviji radovi</h2>
        </div>
        <div className="bento-grid">
          <GalleryItem
            className="col-span-12 md:col-span-8 h-[500px]"
            withOverlay
            alt="Portret muškarca sa modernom frizurom"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEjLm54Q9YnpjrRbOOs1pmI2sFEOqFsoVdv0b8_PdZybE9CX3XdJhhp4iEghubqDs6oYqzhGVPm91bi5wsmWZRSiEmwgO118Va8vp-OLnD0KbnpR9PV_WDql5iX6kcDB2EzbTLvugMYi9-aaK5fe33u7KLWUl_PG7XdkKN8sKvDRcqGpnz6nM_eZ1U5u-IQZ-hi-2vbAIksgjeEE_Rq1Fe9Yz9s0Dt4_R4Lg4PQpx40h7J4uabMMYlsXS32nI2eiuU2wVXvZ0Ogjg"
          />
          <GalleryItem
            className="col-span-6 md:col-span-4 h-[500px]"
            alt="Berberski alat u krupnom planu"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCceG0VbPsIx13PZkNSXUxShKOGFLNCfpIHtibJeDxuQFAC7PZTJxjb0eKAQ8DxxPxovo7xbE4tSVKyuCWhae51104xk7iyFLdVURBXUHomKtqZmvjeIN0O2n5qT8JF1v8BuVSJsXuJ5TV7_9BVUjH5R3-wGASXuZB4OowlRzjuLj8MSsGFm6UM-wOZWUQJcRUpRacaEKhghDmV-6sworBTFc8bnuCFYmLP4SinqtDG_CLr51kC5g4_3GeOWMxxWL7ynLyaFItoN_Q"
          />
          <GalleryItem
            className="col-span-6 md:col-span-4 h-[400px]"
            alt="Klijent uživa u brijanju britvom"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu_k2CbuMqZXBLBywF520OQYK1t5IzP0xU0WfIx7MWY4sGFxUUCNeJwGq96iozTkE-C7w_DAjYsQQnWbwLtqbA6V5g7VOT9HOsCobkP2CIIY57R7mauc78otpegKNsTgyWo9Xazq4Pnw9s-UtxDg1nahmeeRUVVvz2NgBc2IcgIwAIstLQCB4BBlr-XUrAHaYeRjQQrjJUtrs797YhxteWc6TVkO3SsP6Cfr7NTttTq9qw8x06oVG_NDSG6hYjLJVaVwkR7797EUM"
          />
          <GalleryItem
            className="col-span-12 md:col-span-8 h-[400px]"
            alt="Širi kadar užurbanog salona"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyCRPWMnx17qmKoTNQfJJjbh6skOGjakU6PqorFWt7hcHsg9jw3M0O1TfbVTDjQNXWEjQbWVmMS_o5NDu_jeLrunnoSyPi5fUJZPh4FxBbWl5lTCLIGO86JNeXRhPo8WS9gjGYdKTFz8nPozgNci3LKJoyxw8fEn7agB9MoNIPr1DbAcH2Bn9HgR9UoErUosBQb0U_12MsHwMLKihKlRzf3vfjqqpRK7uUMhOwb9v3ablPxwgUzeARA4RM-w4fL0nE0Q9Acn53De0"
          />
        </div>
      </div>
    </section>
  );
}
