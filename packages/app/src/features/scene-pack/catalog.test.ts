import { describe, expect, it } from "vite-plus/test";

import { createSceneCatalog } from "./catalog.ts";
import type { ScenePackDefinition } from "./model.ts";

const ids = {
  pack: "7Yp3mK9Qa2Xv",
  secondPack: "Bd8Hk2Wq6NzR",
  destination: "3nT7cQ5yV9Lm",
  secondDestination: "4Fq8rT2Wm9Ks",
  spot: "6Vd3pX8Hn5Qz",
  secondSpot: "2Jm7Rk4Yp8Vc",
  imageScene: "8qN5tK3Wx7Ha",
  videoScene: "5Zr9mD2Kv6Pt",
  secondScene: "9Hs4qW7Xn3Mb",
} as const;

const text = (en: string, zhCN = `中文：${en}`) => ({ en, "zh-CN": zhCN });
const image = { src: "/image.jpg" } as const;

function createPack(overrides: Partial<ScenePackDefinition> = {}): ScenePackDefinition {
  return {
    id: ids.pack,
    locales: ["en", "zh-CN"],
    title: text("Pack One"),
    destinations: [
      {
        id: ids.destination,
        title: text("Destination One", "目的地一"),
        description: text("The first destination.", "第一个目的地。"),
        image,
        spots: [
          {
            id: ids.spot,
            title: text("Spot One", "地点一"),
            position: { x: 0.25, y: 0.75 },
            scenes: [
              {
                id: ids.imageScene,
                kind: "image",
                title: text("Image Scene", "图片场景"),
                media: image,
              },
              {
                id: ids.videoScene,
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
        id: ids.secondDestination,
        title: text("Destination Two", "目的地二"),
        description: text("The second destination.", "第二个目的地。"),
        image,
        spots: [
          {
            id: ids.secondSpot,
            title: text("Spot Two", "地点二"),
            position: { x: 0.5, y: 0.5 },
            scenes: [
              {
                id: ids.secondScene,
                kind: "image",
                title: text("Second Destination Scene", "第二个目的地场景"),
                media: image,
              },
            ],
          },
        ],
      },
    ],
    ...overrides,
  };
}

function createCatalog(packs: readonly ScenePackDefinition[], locale = "en", baseLocale = "en") {
  return createSceneCatalog(packs, { locale, baseLocale });
}

describe("createSceneCatalog", () => {
  it("preserves authored order and attaches pack IDs to destination read models", () => {
    const catalog = createCatalog([createPack()]);

    expect(catalog.listDestinations()).toEqual([
      expect.objectContaining({
        id: ids.destination,
        packId: ids.pack,
        spotCount: 1,
        sceneCount: 2,
      }),
      expect.objectContaining({
        id: ids.secondDestination,
        packId: ids.pack,
        spotCount: 1,
        sceneCount: 1,
      }),
    ]);
    expect(catalog.getDestination(ids.pack, ids.destination)?.spots[0]?.scenes).toEqual([
      expect.objectContaining({ id: ids.imageScene, preview: image }),
      expect.objectContaining({ id: ids.videoScene, preview: { ...image, src: "/poster.jpg" } }),
    ]);
  });

  it("resolves scenes only within their owning pack and destination", () => {
    const catalog = createCatalog([createPack()]);

    expect(catalog.getScene(ids.pack, ids.destination, ids.videoScene)).toEqual(
      expect.objectContaining({ id: ids.videoScene, kind: "video" }),
    );
    expect(catalog.getScene(ids.pack, ids.secondDestination, ids.videoScene)).toBeUndefined();
    expect(catalog.getScene(ids.secondPack, ids.destination, ids.videoScene)).toBeUndefined();
    expect(catalog.getDestination(ids.pack, "missing-destination")).toBeUndefined();
    expect(catalog.getScene(ids.pack, ids.destination, "missing-scene")).toBeUndefined();
  });

  it("allows content IDs to be reused by different packs", () => {
    const firstPack = createPack();
    const secondPack = createPack({ id: ids.secondPack, title: text("Pack Two") });
    const catalog = createCatalog([firstPack, secondPack]);

    expect(catalog.getDestination(ids.pack, ids.destination)).toEqual(
      expect.objectContaining({ packId: ids.pack }),
    );
    expect(catalog.getDestination(ids.secondPack, ids.destination)).toEqual(
      expect.objectContaining({ packId: ids.secondPack }),
    );
  });

  it("rejects duplicate identifiers within their parent scope", () => {
    const pack = createPack();
    const destination = pack.destinations[0]!;
    const spot = destination.spots[0]!;

    expect(() =>
      createCatalog([{ ...pack, destinations: [...pack.destinations, { ...destination }] }]),
    ).toThrow(`Duplicate destination id ${JSON.stringify(ids.destination)}`);
    expect(() =>
      createCatalog([
        {
          ...pack,
          destinations: [{ ...destination, spots: [...destination.spots, { ...spot }] }],
        },
      ]),
    ).toThrow(`Duplicate spot id ${JSON.stringify(ids.spot)}`);
    expect(() =>
      createCatalog([
        {
          ...pack,
          destinations: [
            { ...destination, spots: [{ ...spot, scenes: [...spot.scenes, spot.scenes[0]!] }] },
          ],
        },
      ]),
    ).toThrow(`Duplicate scene id ${JSON.stringify(ids.imageScene)}`);
    expect(() => createCatalog([pack, pack])).toThrow(
      `Duplicate pack id ${JSON.stringify(ids.pack)}`,
    );
  });

  it("rejects invalid Base58 IDs and unauthorized pack IDs", () => {
    const pack = createPack();
    const destination = pack.destinations[0]!;
    const spot = destination.spots[0]!;

    for (const id of [
      "7Yp3mK9Qa2X",
      "7Yp3mK9Qa2Xvv",
      "0Yp3mK9Qa2Xv",
      "OYp3mK9Qa2Xv",
      "IYp3mK9Qa2Xv",
      "lYp3mK9Qa2Xv",
      "中文识别码1234567",
    ]) {
      expect(() => createCatalog([{ ...pack, id }])).toThrow("must be a 12-character Base58 ID");
    }
    expect(() => createCatalog([{ ...pack, id: "unofficial" }])).toThrow(
      "must be a 12-character Base58 ID",
    );
    expect(() =>
      createCatalog([{ ...pack, destinations: [{ ...destination, id: "official" }] }]),
    ).toThrow("must be a 12-character Base58 ID");
    expect(() =>
      createCatalog([
        { ...pack, destinations: [{ ...destination, spots: [{ ...spot, id: " " }] }] },
      ]),
    ).toThrow("must be a 12-character Base58 ID");
    expect(() =>
      createCatalog([
        {
          ...pack,
          destinations: [
            {
              ...destination,
              spots: [{ ...spot, scenes: [{ ...spot.scenes[0]!, id: "0Yp3mK9Qa2Xv" }] }],
            },
          ],
        },
      ]),
    ).toThrow("must be a 12-character Base58 ID");
  });

  it("accepts the reserved built-in pack IDs", () => {
    const pack = createPack({ id: "official" });
    expect(createCatalog([pack]).getDestination("official", ids.destination)).toBeDefined();
    expect(
      createCatalog([{ ...pack, id: "placeholder" }]).getDestination(
        "placeholder",
        ids.destination,
      ),
    ).toBeDefined();
  });

  it("rejects empty catalog hierarchy levels", () => {
    expect(() => createCatalog([])).toThrow("at least one pack");
    const pack = createPack();
    expect(() => createCatalog([{ ...pack, destinations: [] }])).toThrow(
      "at least one destination",
    );
    const destination = pack.destinations[0]!;
    expect(() =>
      createCatalog([{ ...pack, destinations: [{ ...destination, spots: [] }] }]),
    ).toThrow("at least one spot");
    const spot = destination.spots[0]!;
    expect(() =>
      createCatalog([
        { ...pack, destinations: [{ ...destination, spots: [{ ...spot, scenes: [] }] }] },
      ]),
    ).toThrow("at least one scene");
  });

  it("resolves each pack independently without mixing localized fields", () => {
    const englishFirstPack = createPack();
    const chineseFirstPack = createPack({
      id: ids.secondPack,
      locales: ["zh-CN", "en"],
      destinations: createPack().destinations.map((destination) => ({
        ...destination,
        id: destination.id === ids.destination ? ids.secondDestination : ids.destination,
      })),
    });

    expect(
      createCatalog([englishFirstPack, chineseFirstPack], "fr", "de")
        .listDestinations()
        .map((destination) => destination.title),
    ).toEqual(["Destination One", "Destination Two", "目的地一", "目的地二"]);
  });
});
