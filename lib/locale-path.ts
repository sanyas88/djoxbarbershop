/** Vraća putanju s locale prefiksom, npr. withLocale("bs", "/sign-in") → "/bs/sign-in". */
export function withLocale(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}
