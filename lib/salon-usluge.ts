import { landingImages } from "@/lib/landing-images";

/** Usluge i cijene — usklađeno sa cjenovnikom salona. */
export const salonUsluge = [
  {
    key: "muskoSisanje",
    trajanje: 30,
    cijena: 10,
    cijenaPrikaz: "10 KM",
    slika: landingImages.services.sisanje,
  },
  {
    key: "sisanjeIzbrijavanje",
    trajanje: 45,
    cijena: 15,
    cijenaPrikaz: "15 KM",
    slika: landingImages.services.izbrijavanje,
  },
  {
    key: "uredjivanjeBrade",
    trajanje: 20,
    cijena: 6,
    cijenaPrikaz: "5–7 KM",
    slika: landingImages.services.brada,
  },
  {
    key: "pranjeKose",
    trajanje: 15,
    cijena: 5,
    cijenaPrikaz: "5 KM",
    slika: landingImages.services.pranje,
  },
] as const;
