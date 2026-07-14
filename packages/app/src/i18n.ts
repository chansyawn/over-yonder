import {
  getLocale,
  getTextDirection,
  overwriteGetLocale,
  overwriteSetLocale,
  type Locale,
} from "#app/paraglide/runtime.js";

export type AppLocale = Locale;

export interface AppI18n {
  readonly getLocale: () => AppLocale;
  readonly setLocale: (
    locale: AppLocale,
    options?: { readonly reload?: boolean },
  ) => void | Promise<void>;
}

export function initializeAppI18n(i18n: AppI18n): AppLocale {
  overwriteGetLocale(i18n.getLocale);
  overwriteSetLocale(i18n.setLocale);

  const locale = getLocale();
  document.documentElement.lang = locale;
  document.documentElement.dir = getTextDirection(locale);
  return locale;
}
