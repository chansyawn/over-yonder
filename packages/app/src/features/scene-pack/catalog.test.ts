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
    destinations: [
      {
        id: "destination-one",
        title: "Destination One",
        description: "The first destination.",
        image,
        spots: [
          {
            id: "spot-one",
            title: "Spot One",
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
        id: "destination-two",
        title: "Destination Two",
        description: "The second destination.",
        image,
        spots: [
          {
            id: "spot-two",
            title: "Spot Two",
            position: { x: 0.5, y: 0.5 },
            scenes: [
              {
                id: "second-destination-scene",
                kind: "image",
                title: "Second Destination Scene",
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

    expect(catalog.listDestinations()).toEqual([
      expect.objectContaining({ id: "destination-one", spotCount: 1, sceneCount: 2 }),
      expect.objectContaining({ id: "destination-two", spotCount: 1, sceneCount: 1 }),
    ]);
    expect(catalog.getDestination("destination-one")?.spots[0]?.scenes).toEqual([
      expect.objectContaining({ id: "image-scene", preview: image }),
      expect.objectContaining({
        id: "video-scene",
        preview: { ...image, src: "/poster.jpg" },
      }),
    ]);
  });

  it("resolves scenes only within their owning destination", () => {
    const catalog = createSceneCatalog([createPack()]);

    expect(catalog.getScene("destination-one", "video-scene")).toEqual(
      expect.objectContaining({ id: "video-scene", kind: "video" }),
    );
    expect(catalog.getScene("destination-two", "video-scene")).toBeUndefined();
    expect(catalog.getDestination("missing-destination")).toBeUndefined();
    expect(catalog.getScene("destination-one", "missing-scene")).toBeUndefined();
  });

  it("rejects empty catalog hierarchy levels", () => {
    expect(() => createSceneCatalog([])).toThrow("at least one pack");

    const pack = createPack();
    expect(() => createSceneCatalog([{ ...pack, destinations: [] }])).toThrow(
      "at least one destination",
    );

    const destination = pack.destinations[0];
    expect(() =>
      createSceneCatalog([{ ...pack, destinations: [{ ...destination, spots: [] }] }]),
    ).toThrow("at least one spot");

    const spot = destination?.spots[0];
    expect(() =>
      createSceneCatalog([
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
      createSceneCatalog([
        pack,
        {
          ...pack,
          id: "pack-two",
          title: "Pack Two",
          destinations: [{ ...pack.destinations[0], title: "Duplicate Destination" }],
        },
      ]),
    ).toThrow('Duplicate destination id "destination-one"');
  });

  it("rejects invalid spots and media dimensions", () => {
    const pack = createPack();
    const destination = pack.destinations[0];
    const spot = destination?.spots[0];

    expect(() =>
      createSceneCatalog([
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

    expect(() =>
      createSceneCatalog([
        {
          ...pack,
          destinations: [{ ...destination, image: { ...image, width: 0 } }],
        },
      ]),
    ).toThrow("width must be a positive integer");
  });
});
