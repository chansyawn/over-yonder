import { describe, expect, it } from "vite-plus/test";
import { createOfficialSceneCatalog } from "./index.ts";

describe("official scene packs", () => {
  it("provide complete English and Simplified Chinese content", () => {
    const englishCatalog = createOfficialSceneCatalog("en", "en");
    const chineseCatalog = createOfficialSceneCatalog("zh-CN", "en");

    expect(englishCatalog.getDestination("mars-city")).toEqual(
      expect.objectContaining({
        title: "Mars City",
        image: { src: expect.stringContaining("/maps/mars-city.png") },
      }),
    );
    expect(chineseCatalog.getDestination("mars-city")).toEqual(
      expect.objectContaining({
        title: "火星城",
        image: { src: expect.stringContaining("/maps/mars-city.png") },
      }),
    );
    expect(chineseCatalog.listDestinations()).toHaveLength(
      englishCatalog.listDestinations().length,
    );
  });
});
