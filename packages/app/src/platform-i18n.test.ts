import { beforeEach, describe, expect, it } from "vite-plus/test";
import * as desktopI18n from "../../../apps/desktop/src/paraglide/runtime.js";
import * as websiteI18n from "../../../apps/website/src/paraglide/runtime.js";

const platformRuntimes = [
  ["Website", websiteI18n],
  ["Desktop", desktopI18n],
] as const;

describe.each(platformRuntimes)("%s locale runtime", (_name, runtime) => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/settings");
  });

  it("persists an explicit language before reloading the current route", async () => {
    expect(runtime.strategy).toEqual(["localStorage", "preferredLanguage", "baseLocale"]);

    await runtime.setLocale("zh-CN", { reload: false });

    expect(localStorage.getItem(runtime.localStorageKey)).toBe("zh-CN");
    expect(runtime.getLocale()).toBe("zh-CN");
    expect(window.location.pathname).toBe("/settings");
  });
});
