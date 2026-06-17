import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { hasClerkKeys } from "@/lib/clerk-config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/zakazivanje(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/usluge",
  "/api/slotovi(.*)",
  "/api/webhooks/(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "admin") {
      await auth.protect();
    }
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Dok nema pravih Clerk ključeva, middleware samo propušta zahtjeve.
export default hasClerkKeys() ? clerk : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
