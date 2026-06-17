import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUserId() {
  const { userId } = await auth();
  return userId;
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Niste prijavljeni.");
  return userId;
}

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Niste prijavljeni.");

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") throw new Error("Nemate admin pristup.");

  return userId;
}

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Admin se određuje preko Clerk publicMetadata.role = "admin" (postavlja se u Clerk dashboardu).
  const jeAdmin =
    (clerkUser.publicMetadata as { role?: string } | undefined)?.role === "admin";
  const uloga = jeAdmin ? "ADMIN" : "KLIJENT";

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existing) {
    // Drži ulogu u bazi u skladu sa Clerk-om (ako se promijeni rola).
    if (existing.uloga !== uloga) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { uloga },
      });
    }
    return existing;
  }

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      ime: clerkUser.firstName ?? "",
      prezime: clerkUser.lastName ?? "",
      uloga,
    },
  });
}

// Vraća korisnika samo ako je ADMIN, inače null (autoritativna provjera za admin rute/stranice).
export async function getAdminUser() {
  const user = await getOrCreateUser();
  if (!user || user.uloga !== "ADMIN") return null;
  return user;
}
