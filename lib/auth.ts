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

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      ime: clerkUser.firstName ?? "",
      prezime: clerkUser.lastName ?? "",
      uloga: "KLIJENT",
    },
  });
}
