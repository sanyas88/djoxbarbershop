-- Sprečava preklapajuće aktivne termine (čak i pod konkurentnim upisima).
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "rezervacije"
ADD CONSTRAINT "rezervacije_bez_preklapanja"
EXCLUDE USING gist (
  tsrange("pocetak", "kraj", '[)') WITH &&
)
WHERE ("status" IN ('NA_CEKANJU', 'POTVRDJENO', 'BLOKIRANO'));
