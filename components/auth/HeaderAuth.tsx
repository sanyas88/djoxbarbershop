"use client";

import Link from "next/link";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";

// Prikazuje link na profil + Clerk dugme za nalog/odjavu kada je korisnik prijavljen.
// Kad nije prijavljen ne prikazuje ništa (prijava i dalje iskače tek na potvrdi rezervacije).
export function HeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !isSignedIn) return null;

  const jeAdmin =
    (user?.publicMetadata as { role?: string } | undefined)?.role === "admin";

  return (
    <>
      {jeAdmin && (
        <Link
          href="/admin"
          className="hidden md:inline font-medium text-muted-gray hover:text-blood-red transition-colors duration-300"
        >
          Admin
        </Link>
      )}
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
