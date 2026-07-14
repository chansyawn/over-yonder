import { describe, expect, it } from "vite-plus/test";
import { setLocale, type Locale } from "#app/paraglide/runtime.js";
import { initializeAppI18n } from "./i18n.ts";

describe("initializeAppI18n", () => {
  it("connects the platform runtime and updates document language metadata", async () => {
    let selectedLocale: Locale | undefined;

    const locale = initializeAppI18n({
      getLocale: () => "zh-CN",
      setLocale: (nextLocale) => {
        selectedLocale = nextLocale;
      },
    });

    expect(locale).toBe("zh-CN");
    expect(document.documentElement).toHaveAttribute("lang", "zh-CN");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");

    await setLocale("en");
    expect(selectedLocale).toBe("en");
  });
});
