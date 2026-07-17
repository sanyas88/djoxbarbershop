export function clerkPublishableKey(): string | null {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk || pk.includes("PASTE") || !pk.startsWith("pk_")) return null;
  return pk;
}

export function hasClerkKeys(): boolean {
  const pk = clerkPublishableKey();
  const sk = process.env.CLERK_SECRET_KEY;
  const valid = (k?: string) => !!k && !k.includes("PASTE");
  return !!pk && valid(sk) && !!sk?.startsWith("sk_");
}
