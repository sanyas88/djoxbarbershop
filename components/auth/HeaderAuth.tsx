"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

// Prikazuje link na profil + Clerk dugme za nalog/odjavu kada je korisnik prijavljen.
// Kad nije prijavljen ne prikazuje ništa (prijava i dalje iskače tek na potvrdi rezervacije).
export function HeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <>
      <Link
        href="/moj-profil"
        className="hidden md:inline font-medium text-muted-gray hover:text-blood-red transition-colors duration-300"
      >
        Moj profil
      </Link>
      <UserButton />
    </>
  );
}
