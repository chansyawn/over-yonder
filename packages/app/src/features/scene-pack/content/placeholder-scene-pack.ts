import type {
  DestinationDefinition,
  ImageAssetDefinition,
  LocalizedText,
  ScenePackDefinition,
} from "../model.ts";

function text(en: string, zhCN: string): LocalizedText {
  return { en, "zh-CN": zhCN };
}

const placeholderDescription = text(
  "Placeholder content awaiting final artwork and details.",
  "等待最终美术与详细内容的占位场景。",
);

interface PlaceholderDestinationOptions {
  readonly id: string;
  readonly title: LocalizedText;
  readonly spotId: string;
  readonly spotTitle: LocalizedText;
  readonly sceneId: string;
  readonly sceneTitle: LocalizedText;
  readonly imageLabel: string;
  readonly background: string;
  readonly foreground: string;
}

function placeholderImageAsset(
  label: string,
  alt: LocalizedText,
  background: string,
  foreground: string,
): ImageAssetDefinition {
  return {
    src: `https://placehold.co/1920x1080/${background}/${foreground}.png?text=${encodeURIComponent(label)}`,
    alt,
    width: 1920,
    height: 1080,
  };
}

function createPlaceholderDestination({
  id,
  title,
  spotId,
  spotTitle,
  sceneId,
  sceneTitle,
  imageLabel,
  background,
  foreground,
}: PlaceholderDestinationOptions): DestinationDefinition {
  return {
    id,
    title,
    description: placeholderDescription,
    image: placeholderImageAsset(
      imageLabel,
      text(`Placeholder image for ${imageLabel}`, `${title["zh-CN"]}的占位图片`),
      background,
      foreground,
    ),
    spots: [
      {
        id: spotId,
        title: spotTitle,
        description: placeholderDescription,
        position: { x: 0.5, y: 0.5 },
        scenes: [
          {
            id: sceneId,
            kind: "image",
            title: sceneTitle,
            description: placeholderDescription,
            media: placeholderImageAsset(
              imageLabel,
              text(`Placeholder image for ${imageLabel}`, `${sceneTitle["zh-CN"]}的占位图片`),
              background,
              foreground,
            ),
          },
        ],
      },
    ],
  };
}

const placeholderDestinationOptions = [
  {
    id: "lunar-outpost",
    title: text("Lunar Outpost", "月球前哨站"),
    spotId: "observation-point",
    spotTitle: text("Observation Point", "观测点"),
    sceneId: "lunar-observation",
    sceneTitle: text("Lunar Observation", "月面观测"),
    imageLabel: "Lunar Outpost",
    background: "d9d5cc",
    foreground: "2e2b26",
  },
  {
    id: "cloud-harbor",
    title: text("Cloud Harbor", "云端港湾"),
    spotId: "docking-platform",
    spotTitle: text("Docking Platform", "停靠平台"),
    sceneId: "platform-view",
    sceneTitle: text("Platform View", "平台景观"),
    imageLabel: "Cloud Harbor",
    background: "cbd9df",
    foreground: "24323b",
  },
  {
    id: "verdant-basin",
    title: text("Verdant Basin", "苍翠盆地"),
    spotId: "basin-overlook",
    spotTitle: text("Basin Overlook", "盆地眺望台"),
    sceneId: "verdant-overlook",
    sceneTitle: text("Verdant Overlook", "苍翠远眺"),
    imageLabel: "Verdant Basin",
    background: "ccd8c3",
    foreground: "263326",
  },
  {
    id: "polar-station",
    title: text("Polar Station", "极地站"),
    spotId: "survey-deck",
    spotTitle: text("Survey Deck", "勘测平台"),
    sceneId: "polar-survey",
    sceneTitle: text("Polar Survey", "极地勘测"),
    imageLabel: "Polar Station",
    background: "d8dee3",
    foreground: "29323a",
  },
] satisfies readonly PlaceholderDestinationOptions[];

export const placeholderPack = {
  id: "placeholders",
  locales: ["en", "zh-CN"],
  title: text("Placeholder Destinations", "占位目的地"),
  destinations: placeholderDestinationOptions.map(createPlaceholderDestination),
} satisfies ScenePackDefinition;
