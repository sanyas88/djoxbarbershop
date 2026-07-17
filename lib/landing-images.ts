// Slike za landing — WebP (kompresovano za LCP / Lighthouse).
export const landingImages = {
  hero: "/images/hero-barbershop.webp",
  about: "/images/about-barbershop.webp",
  services: {
    sisanje: "/images/service-sisanje.webp",
    izbrijavanje: "/images/service-izbrijavanje.webp",
    brada: "/images/service-brada.webp",
    pranje: "/images/service-pranje.webp",
  },
  gallery: {
    main: "/images/gallery-main.webp",
    alat: "/images/gallery-alat.webp",
    brijanje: "/images/gallery-brijanje.webp",
    salon: "/images/gallery-salon.webp",
  },
  bookingBg: "/images/booking-bg.webp",
} as const;

// Podaci salona.
export const salonInfo = {
  naziv: "Djox Barbershop",
  slogan: "Preciznost. Stil. Karakter.",
  adresa: "Ulica 9. Januara 10, Vlasenica, Bosna i Hercegovina",
  telefon: "+387 65 788 851",
  telefonLink: "tel:+38765788851",
  instagram: "https://www.instagram.com/djoxbarbershop/",
  placanje: "Samo gotovina",
  radnoVrijeme: "Uto – Pet: 08:00 – 18:00 | Sub – Ned: 11:00 – 18:00",
  radnoVrijemeStavke: [
    { hourKey: "monday", vrijeme: "closed", zatvoreno: true },
    { hourKey: "tueFri", vrijeme: "08:00 – 18:00" },
    { hourKey: "satSun", vrijeme: "11:00 – 18:00" },
  ],
  /** Za embed mape — podesi tačne koordinate kad ih imaš. */
  koordinate: { lat: 44.18183, lng: 18.94096 },
} as const;

const mapaUpit = encodeURIComponent(salonInfo.adresa);

export const salonMapa = {
  embedUrl: `https://www.google.com/maps?q=${mapaUpit}&hl=bs&z=17&output=embed`,
  otvoriUrl: `https://www.google.com/maps/search/?api=1&query=${mapaUpit}`,
} as const;
