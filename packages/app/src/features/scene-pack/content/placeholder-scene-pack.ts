import type { DestinationDefinition, ImageAsset, ScenePackDefinition } from "../model.ts";

const placeholderDescription = "Placeholder content awaiting final artwork and details.";

interface PlaceholderDestinationOptions {
  readonly title: string;
  readonly spotTitle: string;
  readonly sceneTitle: string;
  readonly background: string;
  readonly foreground: string;
}

function titleToId(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function placeholderImageAsset(label: string, background: string, foreground: string): ImageAsset {
  return {
    src: `https://placehold.co/1920x1080/${background}/${foreground}.png?text=${encodeURIComponent(label)}`,
    alt: `Placeholder image for ${label}`,
    width: 1920,
    height: 1080,
  };
}

function createPlaceholderDestination({
  title,
  spotTitle,
  sceneTitle,
  background,
  foreground,
}: PlaceholderDestinationOptions): DestinationDefinition {
  return {
    id: titleToId(title),
    title,
    description: placeholderDescription,
    image: placeholderImageAsset(title, background, foreground),
    spots: [
      {
        id: titleToId(spotTitle),
        title: spotTitle,
        description: placeholderDescription,
        position: { x: 0.5, y: 0.5 },
        scenes: [
          {
            id: titleToId(sceneTitle),
            kind: "image",
            title: sceneTitle,
            description: placeholderDescription,
            media: placeholderImageAsset(sceneTitle, background, foreground),
          },
        ],
      },
    ],
  };
}

const placeholderDestinationOptions = [
  {
    title: "Lunar Outpost",
    spotTitle: "Observation Point",
    sceneTitle: "Lunar Observation",
    background: "d9d5cc",
    foreground: "2e2b26",
  },
  {
    title: "Cloud Harbor",
    spotTitle: "Docking Platform",
    sceneTitle: "Platform View",
    background: "cbd9df",
    foreground: "24323b",
  },
  {
    title: "Verdant Basin",
    spotTitle: "Basin Overlook",
    sceneTitle: "Verdant Overlook",
    background: "ccd8c3",
    foreground: "263326",
  },
  {
    title: "Polar Station",
    spotTitle: "Survey Deck",
    sceneTitle: "Polar Survey",
    background: "d8dee3",
    foreground: "29323a",
  },
] satisfies readonly PlaceholderDestinationOptions[];

export const placeholderPack = {
  id: "placeholders",
  title: "Placeholder Destinations",
  destinations: placeholderDestinationOptions.map(createPlaceholderDestination),
} satisfies ScenePackDefinition;
