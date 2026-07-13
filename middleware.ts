import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher, type ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { hasClerkKeys } from "@/lib/clerk-config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

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

async function handleRequest(req: NextRequest, auth?: ClerkMiddlewareAuth) {
  // API rute nemaju locale prefiks — inače /api/usluge postane /bs/api/usluge (404).
  if (isApiRoute(req)) {
    if (auth) {
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
    }
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(req);
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  if (auth) {
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
  }

  return intlResponse;
}

const clerk = clerkMiddleware(async (auth, req) => handleRequest(req, auth));

export default hasClerkKeys()
  ? clerk
  : (req: NextRequest) => handleRequest(req);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
