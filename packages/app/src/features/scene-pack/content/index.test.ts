import { describe, expect, it } from "vite-plus/test";
import { createOfficialSceneCatalog } from "./index.ts";

describe("official scene packs", () => {
  it("provides the localized rainy lake cabin and placeholder destinations", () => {
    const englishCatalog = createOfficialSceneCatalog("en", "en");
    const chineseCatalog = createOfficialSceneCatalog("zh-CN", "en");

    expect(englishCatalog.listDestinations()).toHaveLength(5);
    expect(chineseCatalog.listDestinations()).toHaveLength(5);
    expect(englishCatalog.getDestination("official", "7Yp3mK9Qa2Xv")).toEqual(
      expect.objectContaining({
        title: "Rainy Lake Cabin",
        image: {
          src: expect.stringContaining("/packs/official/destinations/7Yp3mK9Qa2Xv/map.webp"),
        },
        sceneCount: 1,
      }),
    );
    expect(chineseCatalog.getDestination("official", "7Yp3mK9Qa2Xv")).toEqual(
      expect.objectContaining({ title: "雨湖小屋" }),
    );
    expect(englishCatalog.getScene("official", "7Yp3mK9Qa2Xv", "3nT7cQ5yV9Lm")).toEqual(
      expect.objectContaining({
        kind: "video",
        title: "Rain by the Lake",
        media: {
          src: expect.stringContaining(
            "/packs/official/destinations/7Yp3mK9Qa2Xv/scenes/3nT7cQ5yV9Lm/media.mp4",
          ),
          label: "A warm living room overlooking a rainy mountain lake",
          poster: {
            src: expect.stringContaining(
              "/packs/official/destinations/7Yp3mK9Qa2Xv/scenes/3nT7cQ5yV9Lm/poster.webp",
            ),
          },
        },
      }),
    );
    expect(chineseCatalog.getScene("official", "7Yp3mK9Qa2Xv", "3nT7cQ5yV9Lm")).toEqual(
      expect.objectContaining({
        title: "湖畔听雨",
        media: expect.objectContaining({ label: "一间俯瞰雨中山湖的温暖客厅" }),
      }),
    );
    expect(englishCatalog.getDestination("placeholder", "4Fq8rT2Wm9Ks")).toEqual(
      expect.objectContaining({
        title: "Lunar Outpost",
        sceneCount: 2,
      }),
    );
    expect(englishCatalog.getDestination("official", "7Yp3mK9Qa2Xv")).toMatchObject({
      packId: "official",
    });
    expect(englishCatalog.getDestination("placeholder", "7Yp3mK9Qa2Xv")).toBeUndefined();
  });
});
