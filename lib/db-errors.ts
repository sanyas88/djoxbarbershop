import { Prisma } from "@prisma/client";

/** Postgres exclusion_violation (npr. preklapajući termini). */
export function isPgExclusionViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const message = "message" in error ? String(error.message) : "";
  if (message.includes("23P01") || message.includes("exclusion_violation")) {
    return true;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta as { code?: string; database_error?: string } | undefined;
    if (meta?.code === "23P01") return true;
    if (String(meta?.database_error ?? "").includes("23P01")) return true;
  }

  return false;
}
