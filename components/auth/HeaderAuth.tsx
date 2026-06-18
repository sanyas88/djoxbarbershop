"use client";

import Link from "next/link";
import { useAuth, useUser, UserButton, SignInButton } from "@clerk/nextjs";

// Prijavljen: link na profil (+ Admin) i Clerk dugme za nalog/odjavu.
// Odjavljen: diskretan "Prijava" link (otvara Clerk modal) za stalne klijente.
// Prijava pri potvrdi rezervacije ostaje nepromijenjena.
export function HeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal" fallbackRedirectUrl="/moj-profil">
        <button className="font-medium text-muted-gray transition-colors duration-300 hover:text-blood-red">
          Prijava
        </button>
      </SignInButton>
    );
  }

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
