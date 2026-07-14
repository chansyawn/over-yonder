import { Link } from "@tanstack/react-router";
import { LanguagesIcon } from "lucide-react";
import * as m from "#app/paraglide/messages.js";
import { getLocale, locales, setLocale, type Locale } from "#app/paraglide/runtime.js";

const languageOptions: ReadonlyArray<{
  readonly locale: Locale;
  readonly label: () => string;
}> = [
  { locale: "en", label: m.language_english },
  { locale: "zh-CN", label: m.language_simplified_chinese },
];

export function SettingsPage() {
  const currentLocale = getLocale();

  return (
    <main className="text-foreground flex min-h-screen justify-center px-5 py-8 font-sans sm:px-8 sm:py-10">
      <div className="w-full max-w-xl">
        <Link
          className="border-border bg-background focus-visible:ring-foreground/45 inline-flex rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
          to="/"
        >
          {m.back_to_main_menu_action()}
        </Link>

        <header className="mt-10">
          <LanguagesIcon aria-hidden="true" className="text-muted-foreground size-10 stroke-1" />
          <h1 className="mt-3 font-serif text-5xl font-normal tracking-tight sm:text-6xl">
            {m.settings_title()}
          </h1>
        </header>

        <fieldset className="border-border mt-10 rounded-lg border p-1">
          <legend className="sr-only">{m.language_setting_label()}</legend>
          <div className="border-border/75 rounded-md border p-5 sm:p-6">
            <h2 className="text-lg tracking-widest uppercase">{m.language_setting_label()}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {m.language_setting_description()}
            </p>

            <div className="mt-6 grid gap-3">
              {languageOptions.map((option) => (
                <label
                  key={option.locale}
                  className="border-border has-checked:bg-muted/70 has-focus-visible:ring-foreground/45 flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 outline-none has-focus-visible:ring-2"
                >
                  <input
                    checked={currentLocale === option.locale}
                    className="accent-foreground size-4"
                    name="language"
                    type="radio"
                    value={option.locale}
                    onChange={() => {
                      if (currentLocale !== option.locale && locales.includes(option.locale)) {
                        void setLocale(option.locale);
                      }
                    }}
                  />
                  <span>{option.label()}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>
      </div>
    </main>
  );
}
