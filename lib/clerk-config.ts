export function hasClerkKeys(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const sk = process.env.CLERK_SECRET_KEY;
  const valid = (k?: string) => !!k && !k.includes("PASTE");
  return valid(pk) && !!pk && pk.startsWith("pk_") && valid(sk);
}
