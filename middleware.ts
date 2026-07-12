import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { hasClerkKeys } from "@/lib/clerk-config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/",
  "/bs",
  "/bs/(.*)",
  "/en",
  "/en/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/usluge",
  "/api/slotovi(.*)",
  "/api/webhooks/(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/bs/admin(.*)",
  "/en/admin(.*)",
  "/api/admin(.*)",
]);

const clerk = clerkMiddleware(async (auth, req) => {
  const intlResponse = intlMiddleware(req);
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

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
  return intlResponse;
});

export default hasClerkKeys() ? clerk : intlMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
