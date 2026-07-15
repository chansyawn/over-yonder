import { describe, expect, it } from "vite-plus/test";

import { createSceneCatalog } from "./catalog.ts";
import type { ScenePackDefinition } from "./model.ts";

const text = (en: string, zhCN = `中文：${en}`) => ({ en, "zh-CN": zhCN });

const image = {
  src: "/image.jpg",
} as const;

function createPack(): ScenePackDefinition {
  return {
    id: "pack-one",
    locales: ["en", "zh-CN"],
    title: text("Pack One"),
    destinations: [
      {
        id: "destination-one",
        title: text("Destination One", "目的地一"),
        description: text("The first destination.", "第一个目的地。"),
        image,
        spots: [
          {
            id: "spot-one",
            title: text("Spot One", "地点一"),
            position: { x: 0.25, y: 0.75 },
            scenes: [
              {
                id: "image-scene",
                kind: "image",
                title: text("Image Scene", "图片场景"),
                media: image,
              },
              {
                id: "video-scene",
                kind: "video",
                title: text("Video Scene", "视频场景"),
                description: text("A moving landscape.", "一片流动的风景。"),
                media: {
                  src: "/video.mp4",
                  label: text("Clouds crossing the landscape", "云朵飘过风景"),
                  poster: { ...image, src: "/poster.jpg" },
                },
              },
            ],
          },
        ],
      },
      {
        id: "destination-two",
        title: text("Destination Two", "目的地二"),
        description: text("The second destination.", "第二个目的地。"),
        image,
        spots: [
          {
            id: "spot-two",
            title: text("Spot Two", "地点二"),
            position: { x: 0.5, y: 0.5 },
            scenes: [
              {
                id: "second-destination-scene",
                kind: "image",
                title: text("Second Destination Scene", "第二个目的地场景"),
                media: image,
              },
            ],
          },
        ],
      },
    ],
  };
}

function createCatalog(packs: readonly ScenePackDefinition[], locale = "en", baseLocale = "en") {
  return createSceneCatalog(packs, { locale, baseLocale });
}

describe("createSceneCatalog", () => {
  it("preserves authored order and creates UI-facing read models", () => {
    const catalog = createCatalog([createPack()]);
    const resolvedImage = { src: "/image.jpg" };

    expect(catalog.listDestinations()).toEqual([
      expect.objectContaining({ id: "destination-one", spotCount: 1, sceneCount: 2 }),
      expect.objectContaining({ id: "destination-two", spotCount: 1, sceneCount: 1 }),
    ]);
    expect(catalog.getDestination("destination-one")?.spots[0]?.scenes).toEqual([
      expect.objectContaining({ id: "image-scene", preview: resolvedImage }),
      expect.objectContaining({
        id: "video-scene",
        preview: { ...resolvedImage, src: "/poster.jpg" },
      }),
    ]);
  });

  it("resolves scenes only within their owning destination", () => {
    const catalog = createCatalog([createPack()]);

    expect(catalog.getScene("destination-one", "video-scene")).toEqual(
      expect.objectContaining({ id: "video-scene", kind: "video" }),
    );
    expect(catalog.getScene("destination-two", "video-scene")).toBeUndefined();
    expect(catalog.getDestination("missing-destination")).toBeUndefined();
    expect(catalog.getScene("destination-one", "missing-scene")).toBeUndefined();
  });

  it("rejects empty catalog hierarchy levels", () => {
    expect(() => createCatalog([])).toThrow("at least one pack");

    const pack = createPack();
    expect(() => createCatalog([{ ...pack, destinations: [] }])).toThrow(
      "at least one destination",
    );

    const destination = pack.destinations[0];
    expect(() =>
      createCatalog([{ ...pack, destinations: [{ ...destination, spots: [] }] }]),
    ).toThrow("at least one spot");

    const spot = destination?.spots[0];
    expect(() =>
      createCatalog([
        {
          ...pack,
          destinations: [{ ...destination, spots: [{ ...spot, scenes: [] }] }],
        },
      ]),
    ).toThrow("at least one scene");
  });

  it("rejects duplicate identifiers across the catalog", () => {
    const pack = createPack();

    expect(() =>
      createCatalog([
        pack,
        {
          ...pack,
          id: "pack-two",
          title: text("Pack Two"),
          destinations: [{ ...pack.destinations[0], title: text("Duplicate Destination") }],
        },
      ]),
    ).toThrow('Duplicate destination id "destination-one"');
  });

  it("rejects invalid spots", () => {
    const pack = createPack();
    const destination = pack.destinations[0];
    const spot = destination?.spots[0];

    expect(() =>
      createCatalog([
        {
          ...pack,
          destinations: [
            {
              ...destination,
              spots: [{ ...spot, position: { x: -0.1, y: 0.5 } }],
            },
          ],
        },
      ]),
    ).toThrow("x must be between 0 and 1");
  });

  it("localizes each pack once using exact, language, base, and authored fallbacks", () => {
    const pack = createPack();

    expect(createCatalog([pack], "zh-CN").getDestination("destination-one")?.title).toBe(
      "目的地一",
    );
    expect(createCatalog([pack], "zh-Hans").getDestination("destination-one")?.title).toBe(
      "目的地一",
    );
    expect(createCatalog([pack], "fr", "en-US").getDestination("destination-one")?.title).toBe(
      "Destination One",
    );

    const zhFirstPack = { ...pack, locales: ["zh-CN", "en"] };
    expect(createCatalog([zhFirstPack], "fr", "de").listDestinations()[0]?.title).toBe("目的地一");
  });

  it("resolves each pack independently without mixing localized fields", () => {
    const englishFirstPack = createPack();
    const chineseFirstPack = {
      ...createPack(),
      id: "pack-two",
      locales: ["zh-CN", "en"],
      destinations: createPack().destinations.map((destination) => ({
        ...destination,
        id: `second-${destination.id}`,
        spots: destination.spots.map((spot) => ({
          ...spot,
          id: `second-${spot.id}`,
          scenes: spot.scenes.map((scene) => ({ ...scene, id: `second-${scene.id}` })),
        })),
      })),
    };

    const destinations = createCatalog([englishFirstPack, chineseFirstPack], "fr", "de")
      .listDestinations()
      .map((destination) => destination.title);

    expect(destinations).toEqual(["Destination One", "Destination Two", "目的地一", "目的地二"]);
  });

  it("rejects invalid locale declarations and incomplete localized fields", () => {
    const pack = createPack();

    expect(() => createCatalog([{ ...pack, locales: [] }])).toThrow("at least one locale");
    expect(() => createCatalog([{ ...pack, locales: ["en", "EN"] }])).toThrow("duplicate locale");
    expect(() => createCatalog([{ ...pack, locales: ["not_a_locale"] }])).toThrow("valid BCP-47");
    expect(() => createCatalog([{ ...pack, title: { en: "Pack One" } }])).toThrow(
      'translation for "zh-CN"',
    );
    expect(() => createCatalog([{ ...pack, title: { ...pack.title, "zh-CN": " " } }])).toThrow(
      "must not be empty",
    );
    expect(() => createCatalog([{ ...pack, title: { ...pack.title, fr: "Paquet" } }])).toThrow(
      "undeclared locale",
    );
  });
});
