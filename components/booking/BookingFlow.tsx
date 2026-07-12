"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { RADNO_VRIJEME } from "@/lib/booking-config";
import { serviceI18nKey } from "@/lib/service-i18n";

type Usluga = {
  id: string;
  naziv: string;
  trajanje: number;
  cijena: number;
  opis: string | null;
};

type Slot = { pocetak: string; vrijeme: string };

function StepIndicator({ korak }: { korak: number }) {
  const t = useTranslations("booking.steps");
  const koraci = [t("service"), t("slot"), t("confirm")];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
      {koraci.map((naziv, i) => {
        const broj = i + 1;
        const aktivan = korak >= broj;
        return (
          <div key={naziv} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                  aktivan
                    ? "border-blood-red bg-blood-red text-pure-white"
                    : "border-border-subtle text-muted-gray"
                }`}
              >
                {broj}
              </span>
              <span
                className={`hidden text-xs font-bold uppercase tracking-widest sm:inline ${
                  aktivan ? "text-pure-white" : "text-muted-gray"
                }`}
              >
                {naziv}
              </span>
            </div>
            {i < koraci.length - 1 && (
              <span
                className={`h-px w-6 sm:w-12 ${
                  korak > broj ? "bg-blood-red" : "bg-border-subtle"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function useServiceText() {
  const t = useTranslations("services");

  return {
    name(naziv: string) {
      const key = serviceI18nKey(naziv);
      return key ? t(`${key}.name`) : naziv;
    },
    desc(naziv: string, fallback: string | null) {
      const key = serviceI18nKey(naziv);
      return key ? t(`${key}.desc`) : (fallback ?? "");
    },
  };
}

export function BookingFlow() {
  const t = useTranslations("booking");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const serviceText = useServiceText();
  const { isLoaded, isSignedIn } = useAuth();

  const DAN_NAZIV = t.raw("days") as string[];
  const MJESEC_NAZIV = t.raw("months") as string[];

  const [korak, setKorak] = useState<1 | 2 | 3 | 4>(1);

  const [usluge, setUsluge] = useState<Usluga[]>([]);
  const [ucitavanjeUsluga, setUcitavanjeUsluga] = useState(true);
  const [greskaUsluge, setGreskaUsluge] = useState("");

  const [usluga, setUsluga] = useState<Usluga | null>(null);
  const [datum, setDatum] = useState<string>("");

  const [slotovi, setSlotovi] = useState<Slot[]>([]);
  const [ucitavanjeSlotova, setUcitavanjeSlotova] = useState(false);
  const [zatvoreno, setZatvoreno] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);

  const [napomena, setNapomena] = useState("");
  const [slanje, setSlanje] = useState(false);
  const [greska, setGreska] = useState("");

  const dani = useMemo(() => {
    const sada = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(sada.getFullYear(), sada.getMonth(), sada.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;
      return {
        iso,
        dan: DAN_NAZIV[d.getDay()],
        broj: d.getDate(),
        mjesec: MJESEC_NAZIV[d.getMonth()],
        zatvoreno: RADNO_VRIJEME[d.getDay()] === null,
        danas: i === 0,
      };
    });
  }, [DAN_NAZIV, MJESEC_NAZIV]);

  useEffect(() => {
    let aktivno = true;
    (async () => {
      try {
        const res = await fetch("/api/usluge");
        if (!res.ok) throw new Error();
        const data: Usluga[] = await res.json();
        if (aktivno) setUsluge(data);
      } catch {
        if (aktivno) setGreskaUsluge(t("errorServices"));
      } finally {
        if (aktivno) setUcitavanjeUsluga(false);
      }
    })();
    return () => {
      aktivno = false;
    };
  }, [t]);

  useEffect(() => {
    if (!usluga || !datum) return;
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      setUcitavanjeSlotova(true);
      setSlot(null);
      setSlotovi([]);
      try {
        const res = await fetch(
          `/api/slotovi?uslugaId=${usluga.id}&datum=${datum}`,
          { signal },
        );
        const data = await res.json();
        if (signal.aborted) return;
        setSlotovi(data.slotovi ?? []);
        setZatvoreno(Boolean(data.zatvoreno));
      } catch {
        if (!signal.aborted) setSlotovi([]);
      } finally {
        if (!signal.aborted) setUcitavanjeSlotova(false);
      }
    })();
    return () => controller.abort();
  }, [usluga, datum]);

  function izaberiUslugu(u: Usluga) {
    setUsluga(u);
    setDatum("");
    setSlot(null);
    setKorak(2);
  }

  async function potvrdi() {
    if (!usluga || !slot) return;
    setSlanje(true);
    setGreska("");
    try {
      const res = await fetch("/api/rezervacije", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uslugaId: usluga.id,
          pocetak: slot.pocetak,
          napomena: napomena.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.greska ?? t("errors.booking"));
        if (res.status === 409) {
          setSlot(null);
          setKorak(2);
        }
        return;
      }
      setKorak(4);
    } catch {
      setGreska(t("errors.network"));
    } finally {
      setSlanje(false);
    }
  }

  const datumLabel = useMemo(() => {
    const d = dani.find((x) => x.iso === datum);
    return d ? `${d.dan}, ${d.broj}. ${d.mjesec}` : "";
  }, [datum, dani]);

  return (
    <div className="mx-auto max-w-3xl">
      {korak < 4 && <StepIndicator korak={korak} />}

      {korak === 1 && (
        <div>
          <h2 className="font-headline-lg text-3xl uppercase text-pure-white mb-2">
            {t("step1Title")}
          </h2>
          <p className="text-muted-gray mb-8 text-sm">{t("step1Subtitle")}</p>

          {ucitavanjeUsluga && <p className="text-muted-gray">{t("loadingServices")}</p>}
          {greskaUsluge && <p className="text-blood-red">{greskaUsluge}</p>}

          <div className="grid grid-cols-1 gap-4">
            {usluge.map((u) => (
              <button
                key={u.id}
                onClick={() => izaberiUslugu(u)}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface-container p-6 text-left transition-all hover:border-blood-red/60"
              >
                <div>
                  <h3 className="font-headline-lg text-xl uppercase text-pure-white">
                    {serviceText.name(u.naziv)}
                  </h3>
                  {u.opis && (
                    <p className="mt-1 text-sm text-muted-gray">{serviceText.desc(u.naziv, u.opis)}</p>
                  )}
                  <p className="mt-2 text-xs uppercase tracking-widest text-muted-gray">
                    {u.trajanje} {tCommon("min")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-headline-lg text-2xl text-blood-red">
                    {u.cijena} KM
                  </span>
                  <span className="mt-2 block text-xs uppercase tracking-widest text-muted-gray transition-colors group-hover:text-pure-white">
                    {t("select")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {korak === 2 && usluga && (
        <div>
          <button
            onClick={() => setKorak(1)}
            className="mb-6 text-xs uppercase tracking-widest text-muted-gray hover:text-pure-white"
          >
            {t("backServices")}
          </button>
          <h2 className="font-headline-lg text-3xl uppercase text-pure-white mb-2">
            {t("step2Title")}
          </h2>
          <p className="text-muted-gray mb-8 text-sm">
            {serviceText.name(usluga.naziv)} · {usluga.trajanje} {tCommon("min")} · {usluga.cijena} KM
          </p>

          <div className="no-scrollbar -mx-2 mb-8 flex gap-3 overflow-x-auto px-2 pb-2">
            {dani.map((d) => {
              const aktivan = d.iso === datum;
              return (
                <button
                  key={d.iso}
                  disabled={d.zatvoreno}
                  onClick={() => setDatum(d.iso)}
                  className={`flex min-w-[68px] flex-col items-center rounded-xl border px-3 py-3 transition-all ${
                    aktivan
                      ? "border-blood-red bg-blood-red text-pure-white"
                      : d.zatvoreno
                        ? "cursor-not-allowed border-border-subtle text-muted-gray/40"
                        : "border-border-subtle text-on-background hover:border-blood-red/60"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest">
                    {d.danas ? t("today") : d.dan}
                  </span>
                  <span className="mt-1 text-lg font-bold">{d.broj}</span>
                  <span className="text-[10px] uppercase">{d.mjesec}</span>
                </button>
              );
            })}
          </div>

          {!datum && <p className="text-muted-gray text-sm">{t("pickDay")}</p>}
          {datum && ucitavanjeSlotova && <p className="text-muted-gray text-sm">{t("loadingSlots")}</p>}
          {datum && !ucitavanjeSlotova && zatvoreno && (
            <p className="text-muted-gray text-sm">{t("closedDay")}</p>
          )}
          {datum && !ucitavanjeSlotova && !zatvoreno && slotovi.length === 0 && (
            <p className="text-muted-gray text-sm">{t("noSlots")}</p>
          )}

          {datum && !ucitavanjeSlotova && slotovi.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {slotovi.map((s) => {
                const aktivan = slot?.pocetak === s.pocetak;
                return (
                  <button
                    key={s.pocetak}
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border py-3 text-sm font-bold transition-all ${
                      aktivan
                        ? "border-blood-red bg-blood-red text-pure-white"
                        : "border-border-subtle text-on-background hover:border-blood-red/60"
                    }`}
                  >
                    {s.vrijeme}
                  </button>
                );
              })}
            </div>
          )}

          {slot && (
            <button
              onClick={() => setKorak(3)}
              className="mt-10 w-full rounded-lg bg-blood-red py-4 font-button-text uppercase tracking-[0.2em] text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95"
            >
              {t("continue")}
            </button>
          )}
        </div>
      )}

      {korak === 3 && usluga && slot && (
        <div>
          <button
            onClick={() => setKorak(2)}
            className="mb-6 text-xs uppercase tracking-widest text-muted-gray hover:text-pure-white"
          >
            {t("backSlot")}
          </button>
          <h2 className="font-headline-lg text-3xl uppercase text-pure-white mb-8">
            {t("step3Title")}
          </h2>

          <div className="rounded-2xl border border-border-subtle bg-surface-container p-6">
            <Red naziv={t("summary.service")} vrijednost={serviceText.name(usluga.naziv)} />
            <Red naziv={t("summary.duration")} vrijednost={`${usluga.trajanje} ${tCommon("min")}`} />
            <Red naziv={t("summary.date")} vrijednost={datumLabel} />
            <Red naziv={t("summary.time")} vrijednost={slot.vrijeme} />
            <Red naziv={t("summary.price")} vrijednost={`${usluga.cijena} KM`} zadnji />
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-gray">
              {t("note")}
            </label>
            <textarea
              value={napomena}
              onChange={(e) => setNapomena(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder={t("notePlaceholder")}
              className="rounded-lg border border-border-subtle bg-surface-container-high px-4 py-3 text-on-background transition-all focus:border-blood-red focus:ring-blood-red"
            />
          </div>

          {greska && (
            <p className="mt-6 rounded-lg border border-blood-red/40 bg-blood-red/10 px-4 py-3 text-sm text-blood-red">
              {greska}
            </p>
          )}

          <div className="mt-8">
            {!isLoaded ? (
              <p className="text-muted-gray text-sm">{t("loading")}</p>
            ) : isSignedIn ? (
              <button
                onClick={potvrdi}
                disabled={slanje}
                className="w-full rounded-lg bg-blood-red py-5 font-button-text uppercase tracking-[0.2em] text-lg text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
              >
                {slanje ? t("confirming") : t("confirm")}
              </button>
            ) : (
              <>
                <p className="mb-4 text-center text-sm text-muted-gray">{t("signInHint")}</p>
                <SignInButton mode="modal">
                  <button className="w-full rounded-lg bg-blood-red py-5 font-button-text uppercase tracking-[0.2em] text-lg text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95">
                    {t("signInConfirm")}
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      )}

      {korak === 4 && usluga && slot && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blood-red">
            <span className="material-symbols-outlined text-3xl text-pure-white">check</span>
          </div>
          <h2 className="font-headline-lg text-4xl uppercase text-pure-white">
            {t("successTitle")}
          </h2>
          <p className="mt-4 text-muted-gray">
            {t("successText", {
              service: serviceText.name(usluga.naziv),
              date: datumLabel,
              time: slot.vrijeme,
            })}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/moj-profil"
              className="rounded-lg bg-blood-red px-8 py-4 font-button-text uppercase tracking-widest text-sm text-pure-white transition-all hover:scale-[1.02]"
            >
              {t("myAppointments")}
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-border-subtle px-8 py-4 font-button-text uppercase tracking-widest text-sm text-on-background transition-all hover:border-blood-red/60"
            >
              {tNav("home")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Red({
  naziv,
  vrijednost,
  zadnji,
}: {
  naziv: string;
  vrijednost: string;
  zadnji?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        zadnji ? "" : "border-b border-border-subtle"
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-widest text-muted-gray">{naziv}</span>
      <span className="text-on-background">{vrijednost}</span>
    </div>
  );
}
