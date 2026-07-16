import { Select } from "@base-ui/react/select";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, CheckIcon, ChevronDownIcon } from "lucide-react";
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
    <main className="text-foreground min-h-screen px-8 py-8 font-sans">
      <header className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center font-serif">
        <Link
          aria-label={m.back_to_main_menu_action()}
          className="text-muted-foreground hover:text-foreground items-center rounded-sm uppercase"
          to="/"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-5" />
        </Link>
        <h1 className="text-center text-2xl tracking-widest uppercase">{m.settings_title()}</h1>
        <span aria-hidden="true" />
      </header>

      <section className="mx-auto mt-8 w-full max-w-7xl">
        <Select.Root<Locale>
          value={currentLocale}
          onValueChange={(locale) => {
            if (locale !== null && locale !== currentLocale && locales.includes(locale)) {
              void setLocale(locale);
            }
          }}
        >
          <div className="border-border flex items-center justify-between gap-8 border-y px-1 py-4">
            <div className="min-w-0 flex-1">
              <Select.Label className="tracking-widest uppercase">
                {m.language_setting_label()}
              </Select.Label>
            </div>

            <Select.Trigger className="border-border bg-background hover:bg-muted/70 focus-visible:ring-foreground/45 flex h-10 w-36 shrink-0 items-center justify-between gap-3 rounded-md border px-3 text-sm transition-colors outline-none focus-visible:ring-2">
              <Select.Value>
                {(locale: Locale | null) =>
                  languageOptions.find((option) => option.locale === locale)?.label()
                }
              </Select.Value>
              <Select.Icon>
                <ChevronDownIcon aria-hidden="true" className="size-4" />
              </Select.Icon>
            </Select.Trigger>
          </div>

          <Select.Portal>
            <Select.Positioner
              align="end"
              alignItemWithTrigger={false}
              className="z-50"
              sideOffset={4}
            >
              <Select.Popup className="border-border bg-background min-w-(--anchor-width) origin-(--transform-origin) rounded-md border p-1 shadow-sm transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                <Select.List>
                  {languageOptions.map((option) => (
                    <Select.Item
                      key={option.locale}
                      className="data-highlighted:bg-muted grid cursor-default grid-cols-[1fr_auto] items-center gap-3 rounded-sm px-3 py-2 text-sm outline-none"
                      value={option.locale}
                    >
                      <Select.ItemText>{option.label()}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon aria-hidden="true" className="size-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </section>
    </main>
  );
}
