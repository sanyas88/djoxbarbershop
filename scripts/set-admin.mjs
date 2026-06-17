import { readFileSync } from "node:fs";

// Učitaj CLERK_SECRET_KEY iz .env (bez dodatnih zavisnosti).
const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
const linija = env.split(/\r?\n/).find((l) => l.startsWith("CLERK_SECRET_KEY"));
const secret = linija?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
if (!secret) throw new Error("Nema CLERK_SECRET_KEY u .env");

const clerkId = process.argv[2];
if (!clerkId) throw new Error("Upotreba: node scripts/set-admin.mjs <clerkUserId>");

const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}/metadata`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ public_metadata: { role: "admin" } }),
});

const data = await res.json();
if (!res.ok) {
  console.error("Greška:", res.status, JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log("OK — role=admin postavljen za", data.email_addresses?.[0]?.email_address ?? clerkId);
console.log("public_metadata:", JSON.stringify(data.public_metadata));
