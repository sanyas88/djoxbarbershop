"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { RADNO_VRIJEME } from "@/lib/booking-config";
import { serviceI18nKey } from "@/lib/service-i18n";
import { withLocale } from "@/lib/locale-path";
import { isClerkEnabledClient } from "@/lib/clerk-config-client";
import {
  saveBookingDraft,
  loadBookingDraft,
  clearBookingDraft,
} from "@/lib/booking-draft";

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
  const locale = useLocale();
  const zakazivanjeUrl = withLocale(locale, "/zakazivanje");
  const signInUrl = `${withLocale(locale, "/sign-in")}?redirect_url=${encodeURIComponent(zakazivanjeUrl)}`;
  const serviceText = useServiceText();
  const clerkEnabled = isClerkEnabledClient();
  const router = useRouter();

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
  const slotRef = useRef<Slot | null>(null);
  const [cekamPrijavu, setCekamPrijavu] = useState(false);
  const draftRestored = useRef(false);

  useEffect(() => {
    slotRef.current = slot;
  }, [slot]);

  const [napomena, setNapomena] = useState("");
  const [slanje, setSlanje] = useState(false);
  const [provjeraSlota, setProvjeraSlota] = useState(false);
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
        dan: t(`days.${d.getDay()}`),
        broj: d.getDate(),
        mjesec: t(`months.${d.getMonth()}`),
        zatvoreno: RADNO_VRIJEME[d.getDay()] === null,
        danas: i === 0,
      };
    });
  }, [t]);

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

  // Vrati uslugu/termin nakon logina (sessionStorage draft).
  useEffect(() => {
    if (ucitavanjeUsluga || draftRestored.current || usluge.length === 0) return;
    draftRestored.current = true;
    const draft = loadBookingDraft();
    if (!draft) return;
    const u = usluge.find((x) => x.id === draft.uslugaId);
    if (!u) {
      clearBookingDraft();
      return;
    }
    setUsluga(u);
    setDatum(draft.datum);
    setSlot(draft.slot);
    setNapomena(draft.napomena ?? "");
    setKorak(3);
    if (draft.pendingConfirm) setCekamPrijavu(true);
  }, [ucitavanjeUsluga, usluge]);

  function sacuvajDraftZaLogin() {
    if (!usluga || !slot || !datum) return;
    saveBookingDraft({
      uslugaId: usluga.id,
      datum,
      slot,
      napomena,
      pendingConfirm: true,
    });
    setCekamPrijavu(true);
  }

  const ucitajSlotove = useCallback(
    async (opts?: { silent?: boolean; signal?: AbortSignal }) => {
      if (!usluga || !datum) return null;

      if (!opts?.silent) {
        setUcitavanjeSlotova(true);
        setSlotovi([]);
      }

      try {
        const res = await fetch(
          `/api/slotovi?uslugaId=${usluga.id}&datum=${datum}`,
          { signal: opts?.signal },
        );
        const data = await res.json();
        if (opts?.signal?.aborted) return null;

        const novi: Slot[] = data.slotovi ?? [];
        setSlotovi(novi);
        setZatvoreno(Boolean(data.zatvoreno));

        const trenutni = slotRef.current;
        if (trenutni && !novi.some((s) => s.pocetak === trenutni.pocetak)) {
          setSlot(null);
          if (!opts?.silent) setGreska(t("errors.slotTaken"));
        }

        return novi;
      } catch (err) {
        if (opts?.signal?.aborted || (err instanceof DOMException && err.name === "AbortError")) {
          return null;
        }
        if (!opts?.silent) setSlotovi([]);
        return null;
      } finally {
        if (!opts?.silent && !opts?.signal?.aborted) {
          setUcitavanjeSlotova(false);
        }
      }
    },
    [usluga, datum, t],
  );

  useEffect(() => {
    // Poslije koraka 2 ne osvježavaj slotove — zauzeti termin bi obrisao izbor / success UI.
    if (!usluga || !datum || korak >= 3) return;
    const controller = new AbortController();
    // Ne briši greska ovdje — poruka „termin zauzet“ mora ostati vidljiva.
    ucitajSlotove({ signal: controller.signal });
    return () => controller.abort();
  }, [usluga, datum, ucitajSlotove, korak]);

  // Periodično osvježavanje dok korisnik bira termin (drugi korisnik može zauzeti slot).
  useEffect(() => {
    if (korak !== 2 || !usluga || !datum) return;
    const interval = setInterval(() => {
      ucitajSlotove({ silent: true });
    }, 20_000);
    return () => clearInterval(interval);
  }, [korak, usluga, datum, ucitajSlotove]);

  // Osvježi kad korisnik vrati fokus na tab.
  useEffect(() => {
    if (korak !== 2 || !usluga || !datum) return;
    function onVisible() {
      if (document.visibilityState === "visible") {
        ucitajSlotove({ silent: true });
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [korak, usluga, datum, ucitajSlotove]);

  // Čuvaj draft dok si na potvrdi — da preživi OAuth.
  useEffect(() => {
    if (korak !== 3 || !usluga || !slot || !datum) return;
    const prev = loadBookingDraft();
    saveBookingDraft({
      uslugaId: usluga.id,
      datum,
      slot,
      napomena,
      pendingConfirm: prev?.pendingConfirm ?? false,
    });
  }, [korak, usluga, slot, datum, napomena]);

  function izaberiUslugu(u: Usluga) {
    setUsluga(u);
    setDatum("");
    setSlot(null);
    setGreska("");
    setKorak(2);
  }

  async function nastaviNaPotvrdu() {
    if (!slot) return;
    setProvjeraSlota(true);
    setGreska("");
    try {
      const novi = await ucitajSlotove({ silent: true });
      const josSlobodan = novi?.some((s) => s.pocetak === slot.pocetak);
      if (!josSlobodan) {
        setSlot(null);
        setGreska(t("errors.slotTaken"));
        return;
      }
      setKorak(3);
    } finally {
      setProvjeraSlota(false);
    }
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
        if (res.status === 409) {
          clearBookingDraft();
          setCekamPrijavu(false);
          setSlot(null);
          setKorak(2);
          await ucitajSlotove({ silent: true });
          setGreska(t("errors.slotTaken"));
        } else {
          setGreska(data.greska ?? t("errors.booking"));
        }
        return;
      }
      clearBookingDraft();
      setCekamPrijavu(false);
      setKorak(4);
      // Odmah na profil — prazan success ekran zbog race-a sa slotovima.
      router.replace("/moj-profil");
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

          {greska && <PorukaGreske tekst={greska} />}

          <div
            className="no-scrollbar -mx-2 mb-8 flex gap-3 overflow-x-auto px-2 pb-2 notranslate"
            translate="no"
          >
            {dani.map((d) => {
              const aktivan = d.iso === datum;
              return (
                <button
                  key={d.iso}
                  disabled={d.zatvoreno}
                  onClick={() => {
                    setDatum(d.iso);
                    setSlot(null);
                    setGreska("");
                  }}
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
            <div
              className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 notranslate"
              translate="no"
            >
              {slotovi.map((s) => {
                const aktivan = slot?.pocetak === s.pocetak;
                return (
                  <button
                    key={s.pocetak}
                    onClick={() => {
                    setSlot(s);
                    setGreska("");
                  }}
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
              onClick={nastaviNaPotvrdu}
              disabled={provjeraSlota}
              className="mt-10 w-full rounded-lg bg-blood-red py-4 font-button-text uppercase tracking-[0.2em] text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {provjeraSlota ? t("checkingSlot") : t("continue")}
            </button>
          )}
        </div>
      )}

      {korak === 3 && usluga && slot && (
        <div>
          <button
            onClick={() => {
              setKorak(2);
              setGreska("");
            }}
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

          {greska && <PorukaGreske tekst={greska} />}

          <div className="mt-8">
            {clerkEnabled ? (
              <PotvrdaAuthClerk
                zakazivanjeUrl={zakazivanjeUrl}
                onConfirm={potvrdi}
                onBeforeSignIn={sacuvajDraftZaLogin}
                cekamPrijavu={cekamPrijavu}
                onCekamPrijavuDone={() => setCekamPrijavu(false)}
                slanje={slanje}
                spreman={Boolean(usluga && slot)}
              />
            ) : (
              <>
                <p className="mb-4 text-center text-sm text-muted-gray">{t("signInHint")}</p>
                <Link
                  href={signInUrl}
                  onClick={sacuvajDraftZaLogin}
                  className="block w-full rounded-lg bg-blood-red py-5 text-center font-button-text uppercase tracking-[0.2em] text-lg text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95"
                >
                  {t("signInConfirm")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {korak === 4 && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blood-red">
            <span className="material-symbols-outlined text-3xl text-pure-white">check</span>
          </div>
          <h2 className="font-headline-lg text-4xl uppercase text-pure-white">
            {t("successTitle")}
          </h2>
          {usluga && slot && (
            <p className="mt-4 text-muted-gray">
              {t("successText", {
                service: serviceText.name(usluga.naziv),
                date: datumLabel,
                time: slot.vrijeme,
              })}
            </p>
          )}
          <p className="mt-6 text-sm text-muted-gray">{t("loading")}</p>
        </div>
      )}
    </div>
  );
}

function PotvrdaAuthClerk({
  zakazivanjeUrl,
  onConfirm,
  onBeforeSignIn,
  cekamPrijavu,
  onCekamPrijavuDone,
  slanje,
  spreman,
}: {
  zakazivanjeUrl: string;
  onConfirm: () => void;
  onBeforeSignIn: () => void;
  cekamPrijavu: boolean;
  onCekamPrijavuDone: () => void;
  slanje: boolean;
  spreman: boolean;
}) {
  const t = useTranslations("booking");
  const { isLoaded, isSignedIn } = useAuth();
  const autoPotvrda = useRef(false);
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  // Poslije uspješne prijave — potvrdi tek kad su usluga i slot vraćeni.
  useEffect(() => {
    if (
      !cekamPrijavu ||
      !spreman ||
      !isLoaded ||
      !isSignedIn ||
      slanje ||
      autoPotvrda.current
    ) {
      return;
    }
    autoPotvrda.current = true;
    onCekamPrijavuDone();
    onConfirmRef.current();
  }, [cekamPrijavu, spreman, isLoaded, isSignedIn, slanje, onCekamPrijavuDone]);

  if (!isLoaded) {
    return <p className="text-muted-gray text-sm">{t("loading")}</p>;
  }

  if (isSignedIn) {
    return (
      <button
        onClick={onConfirm}
        disabled={slanje || (cekamPrijavu && spreman)}
        className="w-full rounded-lg bg-blood-red py-5 font-button-text uppercase tracking-[0.2em] text-lg text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
      >
        {slanje || (cekamPrijavu && spreman) ? t("confirming") : t("confirm")}
      </button>
    );
  }

  return (
    <>
      <p className="mb-4 text-center text-sm text-muted-gray">{t("signInHint")}</p>
      <SignInButton
        mode="modal"
        forceRedirectUrl={zakazivanjeUrl}
        fallbackRedirectUrl={zakazivanjeUrl}
        signUpForceRedirectUrl={zakazivanjeUrl}
        signUpFallbackRedirectUrl={zakazivanjeUrl}
      >
        <button
          type="button"
          onClick={onBeforeSignIn}
          className="w-full rounded-lg bg-blood-red py-5 font-button-text uppercase tracking-[0.2em] text-lg text-pure-white shadow-xl shadow-blood-red/30 transition-all hover:scale-[1.01] active:scale-95"
        >
          {t("signInConfirm")}
        </button>
      </SignInButton>
    </>
  );
}

function PorukaGreske({ tekst }: { tekst: string }) {
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-xl border border-blood-red/50 bg-blood-red/15 px-4 py-4 text-sm text-pure-white"
    >
      <span className="material-symbols-outlined shrink-0 text-blood-red" aria-hidden>
        event_busy
      </span>
      <p className="leading-relaxed text-blood-red">{tekst}</p>
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
