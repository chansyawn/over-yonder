import { describe, expect, it } from "vite-plus/test";

import { createSceneCatalog } from "./catalog.ts";
import type { ScenePackDefinition } from "./model.ts";

const image = {
  src: "/image.jpg",
  alt: "A landscape",
  width: 1200,
  height: 800,
} as const;

function createPack(): ScenePackDefinition {
  return {
    id: "pack-one",
    title: "Pack One",
    maps: [
      {
        id: "map-one",
        title: "Map One",
        description: "The first map.",
        image,
        coordinates: [
          {
            id: "coordinate-one",
            title: "Coordinate One",
            position: { x: 0.25, y: 0.75 },
            scenes: [
              {
                id: "image-scene",
                kind: "image",
                title: "Image Scene",
                media: image,
              },
              {
                id: "video-scene",
                kind: "video",
                title: "Video Scene",
                description: "A moving landscape.",
                media: {
                  src: "/video.mp4",
                  label: "Clouds crossing the landscape",
                  poster: { ...image, src: "/poster.jpg" },
                },
              },
            ],
          },
        ],
      },
      {
        id: "map-two",
        title: "Map Two",
        description: "The second map.",
        image,
        coordinates: [
          {
            id: "coordinate-two",
            title: "Coordinate Two",
            position: { x: 0.5, y: 0.5 },
            scenes: [
              {
                id: "second-map-scene",
                kind: "image",
                title: "Second Map Scene",
                media: image,
              },
            ],
          },
        ],
      },
    ],
  };
}

describe("createSceneCatalog", () => {
  it("preserves authored order and creates UI-facing read models", () => {
    const catalog = createSceneCatalog([createPack()]);

    expect(catalog.listMaps()).toEqual([
      expect.objectContaining({ id: "map-one", coordinateCount: 1, sceneCount: 2 }),
      expect.objectContaining({ id: "map-two", coordinateCount: 1, sceneCount: 1 }),
    ]);
    expect(catalog.getMap("map-one")?.coordinates[0]?.scenes).toEqual([
      expect.objectContaining({ id: "image-scene", preview: image }),
      expect.objectContaining({
        id: "video-scene",
        preview: { ...image, src: "/poster.jpg" },
      }),
    ]);
  });

  it("resolves scenes only within their owning map", () => {
    const catalog = createSceneCatalog([createPack()]);

    expect(catalog.getScene("map-one", "video-scene")).toEqual(
      expect.objectContaining({ id: "video-scene", kind: "video" }),
    );
    expect(catalog.getScene("map-two", "video-scene")).toBeUndefined();
    expect(catalog.getMap("missing-map")).toBeUndefined();
    expect(catalog.getScene("map-one", "missing-scene")).toBeUndefined();
  });

  it("rejects empty catalog hierarchy levels", () => {
    expect(() => createSceneCatalog([])).toThrow("at least one pack");

    const pack = createPack();
    expect(() => createSceneCatalog([{ ...pack, maps: [] }])).toThrow("at least one map");

    const map = pack.maps[0];
    expect(() => createSceneCatalog([{ ...pack, maps: [{ ...map, coordinates: [] }] }])).toThrow(
      "at least one coordinate",
    );

    const coordinate = map?.coordinates[0];
    expect(() =>
      createSceneCatalog([
        {
          ...pack,
          maps: [{ ...map, coordinates: [{ ...coordinate, scenes: [] }] }],
        },
      ]),
    ).toThrow("at least one scene");
  });

  it("rejects duplicate identifiers across the catalog", () => {
    const pack = createPack();

    expect(() =>
      createSceneCatalog([
        pack,
        {
          ...pack,
          id: "pack-two",
          title: "Pack Two",
          maps: [{ ...pack.maps[0], title: "Duplicate Map" }],
        },
      ]),
    ).toThrow('Duplicate map id "map-one"');
  });

  it("rejects invalid coordinates and media dimensions", () => {
    const pack = createPack();
    const map = pack.maps[0];
    const coordinate = map?.coordinates[0];

    expect(() =>
      createSceneCatalog([
        {
          ...pack,
          maps: [
            {
              ...map,
              coordinates: [{ ...coordinate, position: { x: -0.1, y: 0.5 } }],
            },
          ],
        },
      ]),
    ).toThrow("x must be between 0 and 1");

    expect(() =>
      createSceneCatalog([
        {
          ...pack,
          maps: [{ ...map, image: { ...image, width: 0 } }],
        },
      ]),
    ).toThrow("width must be a positive integer");
  });
});
