"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Admin akcija nad rezervacijom: otkazivanje termina ili uklanjanje blokade.
// Poziva /api/admin/rezervacije/[id]/otkazi (status -> OTKAZANO).
export function AdminAkcijaDugme({
  rezervacijaId,
  labela = "Otkaži",
}: {
  rezervacijaId: string;
  labela?: string;
}) {
  const router = useRouter();
  const [potvrda, setPotvrda] = useState(false);
  const [slanje, setSlanje] = useState(false);
  const [greska, setGreska] = useState("");

  async function izvrsi() {
    setSlanje(true);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/rezervacije/${rezervacijaId}/otkazi`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setGreska(data.greska ?? "Greška.");
        setSlanje(false);
        return;
      }
      router.refresh();
    } catch {
      setGreska("Greška u komunikaciji sa serverom.");
      setSlanje(false);
    }
  }

  if (greska) {
    return <span className="text-[10px] text-blood-red">{greska}</span>;
  }

  if (!potvrda) {
    return (
      <button
        onClick={() => setPotvrda(true)}
        className="text-[10px] font-bold uppercase tracking-widest text-blood-red transition-colors hover:underline"
      >
        {labela}
      </button>
    );
  }

  return (
    <span className="flex items-center justify-end gap-2">
      <button
        onClick={izvrsi}
        disabled={slanje}
        className="text-[10px] font-bold uppercase tracking-widest text-blood-red disabled:opacity-60"
      >
        {slanje ? "…" : "Potvrdi"}
      </button>
      <button
        onClick={() => setPotvrda(false)}
        disabled={slanje}
        className="text-[10px] uppercase tracking-widest text-muted-gray"
      >
        Nazad
      </button>
    </span>
  );
}
