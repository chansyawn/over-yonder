import type { ScenePackDefinition } from "../../model.ts";

const northernCoastMapUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Northern_coast_Crete.jpg/1920px-Northern_coast_Crete.jpg";
const hautefortHighlandsMapUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Landscape_ch%C3%A2teau_Hautefort_32.jpg/1920px-Landscape_ch%C3%A2teau_Hautefort_32.jpg";
const peristeriViewUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Peristeri_Northern_coast_Crete.jpg/1920px-Peristeri_Northern_coast_Crete.jpg";
const capeSounionUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Landscape_at_Cape_Sounion%2C_Greece.jpg/1920px-Landscape_at_Cape_Sounion%2C_Greece.jpg";
const coastalOverlookUrl =
  "https://upload.wikimedia.org/wikipedia/commons/1/12/Coast_and_beach_landscape_in_U.S.jpg";
const keralaRidgeUrl =
  "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mountain_landscape_in_kerala.jpg";
const windFieldLoopUrl =
  "https://archive.org/download/f-n-mv-ev-wind-turbine-clouds-3-2/f%20n%20mv%20ev%20wind%20turbine%20clouds%203-2.mp4";
const windFieldPosterUrl =
  "https://archive.org/download/f-n-mv-ev-wind-turbine-clouds-3-2/f-n-mv-ev-wind-turbine-clouds-3-2.thumbs/f%20n%20mv%20ev%20wind%20turbine%20clouds%203-2_000008.jpg";

export const openHorizonsPack = {
  id: "open-horizons",
  title: "Open Horizons",
  maps: [
    {
      id: "northern-coast",
      title: "Northern Coast",
      description: "Cliff paths and sheltered coves along a bright Mediterranean coast.",
      image: {
        src: northernCoastMapUrl,
        alt: "A wide view across the northern coast of Crete",
        width: 1920,
        height: 1278,
      },
      coordinates: [
        {
          id: "peristeri",
          title: "Peristeri",
          description: "A quiet headland looking out over the water.",
          position: { x: 0.68, y: 0.44 },
          scenes: [
            {
              id: "peristeri-view",
              kind: "image",
              title: "Peristeri View",
              description: "Settle above the blue water and distant island.",
              media: {
                src: peristeriViewUrl,
                alt: "The Peristeri peninsula and island off the coast of Crete",
                width: 1920,
                height: 1116,
              },
            },
            {
              id: "cape-sounion",
              kind: "image",
              title: "Cape Sounion",
              description: "A broad, sunlit horizon seen from the cape.",
              media: {
                src: capeSounionUrl,
                alt: "A sunlit coastal landscape seen from Cape Sounion in Greece",
                width: 1920,
                height: 1123,
              },
            },
          ],
        },
        {
          id: "western-shore",
          title: "Western Shore",
          description: "A low path where the coast opens into a long beach.",
          position: { x: 0.27, y: 0.64 },
          scenes: [
            {
              id: "coastal-overlook",
              kind: "image",
              title: "Coastal Overlook",
              description: "Watch the shore recede into the afternoon haze.",
              media: {
                src: coastalOverlookUrl,
                alt: "A rugged coast and beach beneath a clear sky",
                width: 1920,
                height: 1280,
              },
            },
          ],
        },
      ],
    },
    {
      id: "hautefort-highlands",
      title: "Hautefort Highlands",
      description: "Green ridges, distant farms, and a wind-brushed open sky.",
      image: {
        src: hautefortHighlandsMapUrl,
        alt: "A wide green landscape seen from the hill of Hautefort",
        width: 1920,
        height: 1278,
      },
      coordinates: [
        {
          id: "mountain-pass",
          title: "Mountain Pass",
          description: "A high trail overlooking layers of green mountains.",
          position: { x: 0.34, y: 0.38 },
          scenes: [
            {
              id: "kerala-ridge",
              kind: "image",
              title: "Kerala Ridge",
              description: "Rest among the shrubs beneath a distant peak.",
              media: {
                src: keralaRidgeUrl,
                alt: "A mountain ridge rising behind green shrubs in Kerala",
                width: 1280,
                height: 960,
              },
            },
          ],
        },
        {
          id: "wind-field",
          title: "Wind Field",
          description: "Open ground under slow clouds and a turning turbine.",
          position: { x: 0.73, y: 0.58 },
          scenes: [
            {
              id: "wind-field-loop",
              kind: "video",
              title: "Wind Field",
              description: "Stay with the clouds as they move over the field.",
              media: {
                src: windFieldLoopUrl,
                label: "Clouds moving behind a wind turbine",
                poster: {
                  src: windFieldPosterUrl,
                  alt: "A wind turbine beneath a cloudy sky",
                  width: 720,
                  height: 480,
                },
              },
            },
          ],
        },
      ],
    },
  ],
} satisfies ScenePackDefinition;
