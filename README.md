# Djox Barbershop

Web aplikacija za online zakazivanje termina u **Djox Barbershop** salonu (Vlasenica, BiH).

## Funkcionalnosti

- Dvojezična landing stranica (bosanski / engleski)
- Online zakazivanje (usluga → termin → potvrda)
- Zaštita od duplog bukiranja (baza + poruke korisniku)
- Korisnički profil s pregledom i otkazivanjem termina
- Admin panel (statistika, blokiranje termina)
- Zapier integracija (Google Calendar + email potvrda)

## Tech stack

- **Next.js 16** (App Router)
- **Prisma 6** + **Neon PostgreSQL**
- **Clerk** (autentifikacija)
- **next-intl** (i18n)
- **Tailwind CSS 4**
- **Zapier** webhooks

## Lokalni razvoj

### 1. Zavisnosti

```bash
npm install
```

### 2. Env varijable

Kopiraj `.env.example` u `.env` i popuni vrijednosti:

```bash
cp .env.example .env
```

### 3. Baza

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4. Dev server

```bash
npm run dev
```

Aplikacija: [http://localhost:3000](http://localhost:3000) → preusmjerava na `/bs`.

## Ključne rute

| Ruta | Opis |
|------|------|
| `/bs`, `/en` | Landing |
| `/bs/zakazivanje` | Zakazivanje |
| `/bs/moj-profil` | Korisnički profil |
| `/bs/admin` | Admin panel |
| `/bs/sign-in` | Prijava (Clerk) |
| `/bs/privatnost` | Pravila privatnosti |

## Admin pristup

U Clerk dashboardu postavi **Public metadata** na admin nalogu:

```json
{ "role": "admin" }
```

## Deploy (Vercel)

1. Push na GitHub
2. Poveži repo na Vercel
3. Postavi env varijable iz `.env.example`
4. Pokreni `npx prisma migrate deploy` na produkcijskoj bazi
5. Testiraj jednu rezervaciju (Zapier webhook)

## Skripte

| Komanda | Opis |
|---------|------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
