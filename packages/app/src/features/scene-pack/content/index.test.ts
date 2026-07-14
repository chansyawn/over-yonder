import { describe, expect, it } from "vite-plus/test";
import { createOfficialSceneCatalog } from "./index.ts";

describe("official scene packs", () => {
  it("provide complete English and Simplified Chinese content", () => {
    const englishCatalog = createOfficialSceneCatalog("en", "en");
    const chineseCatalog = createOfficialSceneCatalog("zh-CN", "en");

    expect(englishCatalog.getDestination("mars-city")).toEqual(
      expect.objectContaining({
        title: "Mars City",
        image: expect.objectContaining({
          alt: "An illustrated overview of a connected city and industrial settlements across the Martian desert",
        }),
      }),
    );
    expect(chineseCatalog.getDestination("mars-city")).toEqual(
      expect.objectContaining({
        title: "火星城",
        image: expect.objectContaining({
          alt: "火星荒漠中相互连接的城市与工业聚居地全景插画",
        }),
      }),
    );
    expect(chineseCatalog.listDestinations()).toHaveLength(
      englishCatalog.listDestinations().length,
    );
  });
});
