function LocationCard({
  src,
  alt,
  name,
  address,
  hours,
}: {
  src: string;
  alt: string;
  name: string;
  address: string;
  hours: string;
}) {
  return (
    <div className="min-w-[400px] bg-surface-container rounded-2xl p-6 border border-border-subtle">
      <div className="rounded-xl overflow-hidden h-48 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full h-full object-cover" alt={alt} src={src} />
      </div>
      <h3 className="font-headline-lg text-xl uppercase text-pure-white mb-2">{name}</h3>
      <p className="text-muted-gray text-sm mb-4">{address}</p>
      <div className="flex items-center gap-2 text-blood-red">
        <span className="material-symbols-outlined text-sm">schedule</span>
        <span className="text-xs uppercase font-bold tracking-widest">{hours}</span>
      </div>
    </div>
  );
}

export function Locations() {
  return (
    <section id="lokacije" className="py-section-gap overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-gutter mb-12 flex justify-between items-end">
        <div>
          <h4 className="font-script text-blood-red text-3xl">Lokacije</h4>
          <h2 className="font-headline-lg text-5xl uppercase text-pure-white">Naše adrese</h2>
        </div>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center hover:bg-blood-red transition-all group">
            <span className="material-symbols-outlined text-pure-white group-hover:scale-110">arrow_back</span>
          </button>
          <button className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center hover:bg-blood-red transition-all group">
            <span className="material-symbols-outlined text-pure-white group-hover:scale-110">arrow_forward</span>
          </button>
        </div>
      </div>
      <div className="flex gap-8 px-gutter overflow-x-auto pb-10 scroll-smooth no-scrollbar">
        <LocationCard
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR2uEg8p8jJ96dMpZcmaWB0v2Y-bF44c2Kj6B_bW3nlhtte7LgXsqarlqwBCrFp5X9QLKw7SvWT6Yz-il1Iqs8qnpJPKXBN44NCPQ0uGa-x_DOogrRhFa67pJw4kunzN89OVCDqCyhRBqIGIauy001pK9xuj8iF4U3HXGaPT8jjJt7OwJFBekzwbaXEJRU4CZfBqmSYhu1Q8eAmcUvgJFYWuDuhRHYO4m7noa9YUSkEKFry3XS8bEbSz1qqiE3rPjS7rCJojXdnrQ"
          alt="Eksterijer salona u centru grada"
          name="Centar Grada"
          address="Glavna ulica 42, Podgorica, Crna Gora"
          hours="09:00 - 21:00"
        />
        <LocationCard
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA36ZTDVaAkwj0Jby5bUnA4LrhggfJuEj9uepsnWDziDMenSWvP-S6PqYZWmzU8rVWaCk7JbGNskc3DZAFgOWE753BG-TLcePsbL410fdYDtWnWE4YDXkt7CDR2GdwHJ2hbzeHFsoMBsyZT789kYZaFfS8HnF7SN-8Wnlgjv9uWkY5h_GcgGSqo_XSYs95qXK4EmDvhhdfOySwOqwxo-lFM4ClCOzg-_9UMY9EQD2EWcLUmFw4UWQ84cuDcohB844pjapLfs2Q-LSE"
          alt="Interijer premium salona"
          name="Delta City"
          address="Cetinjski put bb, Podgorica, Crna Gora"
          hours="10:00 - 22:00"
        />
        <LocationCard
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHOh6L87dZDSfFnHBkFvwKDV007VLVFIyKrh8z6w3wy1mE-_wXaXQ0u-cJ5u6dKpcmgjQFF6prvdEFG8hZ6dupE5lFrIGHPR3pWErw1HA4a9aNeJVckwb0YczrFjtevMqn2d3iAc1MDbya4t3k7aC7hqP7dn_HhaZjY5ccStMTIpOTU_yKVKFwhiOfvvvN37tgAJ5XC7zNZWZ6ZMOy0xrGj9XsERjqrRVX3JZRwWQKku4ZosHoI7rkqZDVhmiBIYz00sbScmYTvDA"
          alt="Ulazni prostor salona sa berberskim stubom"
          name="Preko Morače"
          address="Bulevar Džordža Vašingtona 12, Podgorica"
          hours="08:00 - 20:00"
        />
      </div>
    </section>
  );
}
