"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const DAN_NAZIV = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
const MJESEC_NAZIV = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "avg",
  "sep",
  "okt",
  "nov",
  "dec",
];

function danasISO(): string {
  const sada = new Date();
  return `${sada.getFullYear()}-${String(sada.getMonth() + 1).padStart(2, "0")}-${String(
    sada.getDate(),
  ).padStart(2, "0")}`;
}

// Forma za admin blokiranje termina (status BLOKIRANO — bez klijenta i mejla).
// Datum i vrijeme se biraju iz lista (bez kucanja) — izbjegava se nativni date input.
export function BlokadaForma() {
  const router = useRouter();
  const [datum, setDatum] = useState(danasISO());
  const [od, setOd] = useState("09:00");
  const [doVrijeme, setDoVrijeme] = useState("10:00");
  const [napomena, setNapomena] = useState("");
  const [slanje, setSlanje] = useState(false);
  const [poruka, setPoruka] = useState<{ tip: "ok" | "greska"; tekst: string } | null>(
    null,
  );

  // Sljedećih 30 dana.
  const dani = useMemo(() => {
    const sada = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(sada.getFullYear(), sada.getMonth(), sada.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
      const naziv =
        i === 0
          ? `Danas, ${d.getDate()}. ${MJESEC_NAZIV[d.getMonth()]}`
          : `${DAN_NAZIV[d.getDay()]}, ${d.getDate()}. ${MJESEC_NAZIV[d.getMonth()]}`;
      return { iso, naziv };
    });
  }, []);

  // Vremena od 08:00 do 21:00 u koracima od 30 min (24h format).
  const vremena = useMemo(() => {
    const arr: string[] = [];
    for (let t = 8 * 60; t <= 21 * 60; t += 30) {
      arr.push(
        `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
      );
    }
    return arr;
  }, []);

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    if (doVrijeme <= od) {
      setPoruka({ tip: "greska", tekst: "Kraj mora biti poslije početka." });
      return;
    }
    setSlanje(true);
    setPoruka(null);
    try {
      const res = await fetch("/api/admin/blokada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datum, od, do: doVrijeme, napomena }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPoruka({ tip: "greska", tekst: data.greska ?? "Greška pri blokiranju." });
        setSlanje(false);
        return;
      }
      setPoruka({ tip: "ok", tekst: "Termin je blokiran." });
      setNapomena("");
      setSlanje(false);
      router.refresh();
    } catch {
      setPoruka({ tip: "greska", tekst: "Greška u komunikaciji sa serverom." });
      setSlanje(false);
    }
  }

  const polje =
    "w-full rounded-lg border border-border-subtle bg-charcoal-bg px-4 py-3 text-on-surface outline-none transition-colors focus:border-blood-red";
  const oznaka =
    "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-gray";

  return (
    <form onSubmit={posalji} className="space-y-stack-md">
      <div>
        <label className={oznaka} htmlFor="bl-datum">
          Datum
        </label>
        <select
          id="bl-datum"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
          className={polje}
        >
          {dani.map((d) => (
            <option key={d.iso} value={d.iso}>
              {d.naziv}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-stack-md">
        <div>
          <label className={oznaka} htmlFor="bl-od">
            Od
          </label>
          <select
            id="bl-od"
            value={od}
            onChange={(e) => setOd(e.target.value)}
            className={polje}
          >
            {vremena.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={oznaka} htmlFor="bl-do">
            Do
          </label>
          <select
            id="bl-do"
            value={doVrijeme}
            onChange={(e) => setDoVrijeme(e.target.value)}
            className={polje}
          >
            {vremena.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={oznaka} htmlFor="bl-napomena">
          Napomena (opciono)
        </label>
        <input
          id="bl-napomena"
          type="text"
          value={napomena}
          maxLength={120}
          placeholder="npr. pauza, godišnji, privatno"
          onChange={(e) => setNapomena(e.target.value)}
          className={polje}
        />
      </div>

      {poruka && (
        <p
          className={
            poruka.tip === "ok" ? "text-xs text-on-surface" : "text-xs text-blood-red"
          }
        >
          {poruka.tekst}
        </p>
      )}

      <button
        type="submit"
        disabled={slanje}
        className="haptic-active flex w-full items-center justify-center gap-2 rounded-lg bg-blood-red py-4 font-button-text text-xs uppercase tracking-widest text-pure-white transition-all hover:brightness-110 disabled:opacity-60"
      >
        <Icon name="block" className="text-base" />
        {slanje ? "Blokiram…" : "Blokiraj termin"}
      </button>
    </form>
  );
}
