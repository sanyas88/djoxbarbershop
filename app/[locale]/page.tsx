import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { BrandBar } from "@/components/landing/BrandBar";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Locations } from "@/components/landing/Locations";
import { Gallery } from "@/components/landing/Gallery";
import { BookingCta } from "@/components/landing/BookingCta";
import { Footer } from "@/components/landing/Footer";
import { MobileNav } from "@/components/landing/MobileNav";
import { LandingEffects } from "@/components/landing/LandingEffects";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <BrandBar />
        <About />
        <Services />
        <Locations />
        <Gallery />
        <BookingCta />
      </main>
      <Footer />
      <MobileNav />
      <LandingEffects />
    </>
  );
}
