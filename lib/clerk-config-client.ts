/** Provjera dostupna u klijentskim komponentama (samo NEXT_PUBLIC_ env). */
export function isClerkEnabledClient(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return !!pk && pk.startsWith("pk_") && !pk.includes("PASTE");
}
