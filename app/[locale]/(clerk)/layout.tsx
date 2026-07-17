import { ClerkProvider } from "@clerk/nextjs";
import { srLatn } from "@/lib/clerk-localization";
import { clerkPublishableKey } from "@/lib/clerk-config";

/** Clerk samo na rutama koje trebaju auth (ne na landing-u). */
export default function ClerkSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pk = clerkPublishableKey();
  if (!pk) return children;

  return (
    <ClerkProvider publishableKey={pk} localization={srLatn}>
      {children}
    </ClerkProvider>
  );
}
