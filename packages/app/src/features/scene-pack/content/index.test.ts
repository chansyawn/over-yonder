import { describe, expect, it } from "vite-plus/test";
import { createOfficialSceneCatalog } from "./index.ts";

describe("official scene packs", () => {
  it("provides the localized rainy lake cabin and placeholder destinations", () => {
    const englishCatalog = createOfficialSceneCatalog("en", "en");
    const chineseCatalog = createOfficialSceneCatalog("zh-CN", "en");

    expect(englishCatalog.listDestinations()).toHaveLength(5);
    expect(chineseCatalog.listDestinations()).toHaveLength(5);
    expect(englishCatalog.getDestination("rainy-lake-cabin")).toEqual(
      expect.objectContaining({
        title: "Rainy Lake Cabin",
        image: {
          src: expect.stringContaining("/maps/rainy-lake-cabin.webp"),
        },
        spotCount: 1,
        sceneCount: 1,
      }),
    );
    expect(chineseCatalog.getDestination("rainy-lake-cabin")).toEqual(
      expect.objectContaining({ title: "雨湖小屋" }),
    );
    expect(
      englishCatalog.getScene("rainy-lake-cabin", "rainy-lake-cabin-living-room-rain"),
    ).toEqual(
      expect.objectContaining({
        kind: "video",
        title: "Rain by the Lake",
        media: {
          src: expect.stringContaining("/scenes/rainy-lake-cabin/living-room.mp4"),
          label: "A warm living room overlooking a rainy mountain lake",
          poster: {
            src: expect.stringContaining("/maps/rainy-lake-cabin.webp"),
          },
        },
      }),
    );
    expect(
      chineseCatalog.getScene("rainy-lake-cabin", "rainy-lake-cabin-living-room-rain"),
    ).toEqual(
      expect.objectContaining({
        title: "湖畔听雨",
        media: expect.objectContaining({ label: "一间俯瞰雨中山湖的温暖客厅" }),
      }),
    );
    expect(englishCatalog.getDestination("lunar-outpost")).toEqual(
      expect.objectContaining({
        title: "Lunar Outpost",
        spotCount: 1,
        sceneCount: 2,
      }),
    );
    expect(englishCatalog.getDestination("mars-city")).toBeUndefined();
  });
});
