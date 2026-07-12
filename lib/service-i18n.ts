/** Mapa DB naziva usluge → ključ u messages.services */
export const SERVICE_I18N_KEYS: Record<string, string> = {
  "Muško šišanje": "muskoSisanje",
  "Šišanje sa izbrijvavanjem": "sisanjeIzbrijavanje",
  "Uređivanje brade": "uredjivanjeBrade",
  "Pranje kose": "pranjeKose",
};

export function serviceI18nKey(naziv: string): string | null {
  return SERVICE_I18N_KEYS[naziv] ?? null;
}
