import type { LocalizedText } from "./model.ts";

export function resolvePackLocale(
  locales: readonly string[],
  requestedLocale: string,
  fallbackLocale: string,
): string {
  return (
    findLocale(locales, requestedLocale, true) ??
    findLocale(locales, requestedLocale, false) ??
    findLocale(locales, fallbackLocale, true) ??
    findLocale(locales, fallbackLocale, false) ??
    locales[0]!
  );
}

export function localize(text: LocalizedText, locale: string): string {
  return text[locale]!;
}

function findLocale(
  locales: readonly string[],
  candidate: string,
  exact: boolean,
): string | undefined {
  let candidateLocale: Intl.Locale;
  try {
    candidateLocale = new Intl.Locale(candidate);
  } catch {
    return undefined;
  }

  return locales.find((locale) => {
    const supportedLocale = new Intl.Locale(locale);
    return exact
      ? supportedLocale.toString() === candidateLocale.toString()
      : supportedLocale.language === candidateLocale.language;
  });
}
