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

  it("provides the localized rainy lake cabin video scene", () => {
    const englishCatalog = createOfficialSceneCatalog("en", "en");
    const chineseCatalog = createOfficialSceneCatalog("zh-CN", "en");

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
  });

  it("provides a localized video sample for every placeholder spot", () => {
    const englishCatalog = createOfficialSceneCatalog("en", "en");
    const chineseCatalog = createOfficialSceneCatalog("zh-CN", "en");

    const placeholderDestinationIds = [
      "lunar-outpost",
      "cloud-harbor",
      "verdant-basin",
      "polar-station",
    ] as const;

    for (const destinationId of placeholderDestinationIds) {
      const destination = englishCatalog.getDestination(destinationId);
      expect(destination).toBeDefined();

      if (!destination) {
        throw new Error(`Missing placeholder destination ${destinationId}`);
      }

      for (const spot of destination.spots) {
        expect(spot.scenes.map((scene) => scene.kind)).toEqual(["image", "video"]);
        const videoScene = spot.scenes[1];
        expect(videoScene).toEqual(
          expect.objectContaining({
            kind: "video",
            preview: { src: "https://placeholdervideo.dev/poster/1920x1080" },
          }),
        );
        expect(englishCatalog.getScene(destinationId, videoScene?.id ?? "")).toEqual(
          expect.objectContaining({
            kind: "video",
            media: expect.objectContaining({
              src: "https://placeholdervideo.dev/1920x1080",
              poster: { src: "https://placeholdervideo.dev/poster/1920x1080" },
            }),
          }),
        );
      }
    }

    expect(englishCatalog.getScene("lunar-outpost", "lunar-observation-video-placeholder")).toEqual(
      expect.objectContaining({
        title: "Video Playback Sample",
        description: "A generated video placeholder for validating scene playback.",
        media: {
          src: "https://placeholdervideo.dev/1920x1080",
          label: "A 1920 by 1080 placeholder video",
          poster: { src: "https://placeholdervideo.dev/poster/1920x1080" },
        },
      }),
    );
    expect(chineseCatalog.getScene("lunar-outpost", "lunar-observation-video-placeholder")).toEqual(
      expect.objectContaining({
        title: "视频播放样例",
        description: "用于验证场景播放的生成式占位视频。",
        media: expect.objectContaining({ label: "一个 1920 × 1080 的占位视频" }),
      }),
    );
  });
});
