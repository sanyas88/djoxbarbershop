"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OtkaziDugme({
  rezervacijaId,
  varijanta = "tekst",
}: {
  rezervacijaId: string;
  varijanta?: "tekst" | "dugme";
}) {
  const router = useRouter();
  const [potvrda, setPotvrda] = useState(false);
  const [slanje, setSlanje] = useState(false);
  const [greska, setGreska] = useState("");

  async function otkazi() {
    setSlanje(true);
    setGreska("");
    try {
      const res = await fetch(`/api/rezervacije/${rezervacijaId}/otkazi`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setGreska(data.greska ?? "Greška pri otkazivanju.");
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
    return <span className="text-xs text-blood-red">{greska}</span>;
  }

  if (!potvrda) {
    return (
      <button
        onClick={() => setPotvrda(true)}
        className={
          varijanta === "dugme"
            ? "haptic-active rounded-lg border border-border-subtle px-6 py-3 font-button-text text-xs uppercase text-on-surface transition-colors hover:border-blood-red"
            : "text-xs font-bold uppercase tracking-widest text-muted-gray transition-colors hover:text-blood-red"
        }
      >
        Otkaži
      </button>
    );
  }

  return (
    <span className="flex items-center gap-3">
      <button
        onClick={otkazi}
        disabled={slanje}
        className="text-xs font-bold uppercase tracking-widest text-blood-red disabled:opacity-60"
      >
        {slanje ? "Otkazujem…" : "Potvrdi"}
      </button>
      <button
        onClick={() => setPotvrda(false)}
        disabled={slanje}
        className="text-xs uppercase tracking-widest text-muted-gray"
      >
        Nazad
      </button>
    </span>
  );
}
