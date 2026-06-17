interface ZapierRezervacijaPayload {
  ime: string;
  prezime: string;
  email: string;
  usluga: string;
  pocetak: string;
  kraj: string;
  napomena?: string;
}

interface ZapierBlokadaPayload {
  pocetak: string;
  kraj: string;
  napomena?: string;
}

export async function triggerZapierRezervacija(payload: ZapierRezervacijaPayload) {
  const url = process.env.ZAPIER_WEBHOOK_REZERVACIJA;
  if (!url) throw new Error("ZAPIER_WEBHOOK_REZERVACIJA nije podešen.");
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function triggerZapierBlokada(payload: ZapierBlokadaPayload) {
  const url = process.env.ZAPIER_WEBHOOK_BLOKADA;
  if (!url) throw new Error("ZAPIER_WEBHOOK_BLOKADA nije podešen.");
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
