import type {
  DestinationDefinition,
  DestinationDetail,
  DestinationSummary,
  SceneDefinition,
  SceneDetail,
  ScenePackDefinition,
  SceneSummary,
  SpotDefinition,
  SpotDetail,
} from "./model.ts";
import { localize, resolvePackLocale } from "./localization.ts";
import {
  ensureUnique,
  validateDestination,
  validatePack,
  validateScene,
  validateSpot,
} from "./validation.ts";

export interface SceneCatalog {
  listDestinations(): readonly DestinationSummary[];
  getDestination(destinationId: string): DestinationDetail | undefined;
  getScene(destinationId: string, sceneId: string): SceneDetail | undefined;
}
interface IndexedScene {
  readonly destinationId: string;
  readonly detail: SceneDetail;
}

export interface CreateSceneCatalogOptions {
  readonly locale: string;
  readonly baseLocale: string;
}

export function createSceneCatalog(
  packs: readonly ScenePackDefinition[],
  { locale, baseLocale }: CreateSceneCatalogOptions,
): SceneCatalog {
  if (packs.length === 0) {
    throw new Error("Scene catalog must contain at least one pack.");
  }

  const packIds = new Set<string>();
  const destinationIds = new Set<string>();
  const spotIds = new Set<string>();
  const sceneIds = new Set<string>();
  const destinationSummaries: DestinationSummary[] = [];
  const destinationsById = new Map<string, DestinationDetail>();
  const scenesById = new Map<string, IndexedScene>();

  for (const pack of packs) {
    const packPath = `pack ${JSON.stringify(pack.id)}`;
    validatePack(pack, packPath);
    ensureUnique(packIds, pack.id, "pack");
    const resolvedLocale = resolvePackLocale(pack.locales, locale, baseLocale);

    for (const destination of pack.destinations) {
      const destinationPath = `${packPath}, destination ${JSON.stringify(destination.id)}`;
      validateDestination(destination, pack.locales, destinationPath);
      ensureUnique(destinationIds, destination.id, "destination");

      const spots = destination.spots.map((spot) => {
        const spotPath = `${destinationPath}, spot ${JSON.stringify(spot.id)}`;
        validateSpot(spot, pack.locales, spotPath);
        ensureUnique(spotIds, spot.id, "spot");

        const scenes = spot.scenes.map((scene) => {
          const scenePath = `${spotPath}, scene ${JSON.stringify(scene.id)}`;
          validateScene(scene, pack.locales, scenePath);
          ensureUnique(sceneIds, scene.id, "scene");

          const detail = createSceneDetail(scene, resolvedLocale);
          scenesById.set(scene.id, { destinationId: destination.id, detail });
          return createSceneSummary(scene, resolvedLocale);
        });

        return createSpotDetail(spot, scenes, resolvedLocale);
      });

      const sceneCount = spots.reduce((count, spot) => count + spot.scenes.length, 0);
      const summary = createDestinationSummary(destination, sceneCount, resolvedLocale);
      const detail: DestinationDetail = {
        ...summary,
        spots,
      };

      destinationSummaries.push(summary);
      destinationsById.set(destination.id, detail);
    }
  }

  return {
    listDestinations() {
      return destinationSummaries;
    },
    getDestination(destinationId) {
      return destinationsById.get(destinationId);
    },
    getScene(destinationId, sceneId) {
      const scene = scenesById.get(sceneId);
      return scene?.destinationId === destinationId ? scene.detail : undefined;
    },
  };
}

function createDestinationSummary(
  destination: DestinationDefinition,
  sceneCount: number,
  locale: string,
): DestinationSummary {
  return {
    id: destination.id,
    title: localize(destination.title, locale),
    description: localize(destination.description, locale),
    image: destination.image,
    spotCount: destination.spots.length,
    sceneCount,
  };
}

function createSpotDetail(
  spot: SpotDefinition,
  scenes: readonly SceneSummary[],
  locale: string,
): SpotDetail {
  return {
    id: spot.id,
    title: localize(spot.title, locale),
    ...(spot.description ? { description: localize(spot.description, locale) } : {}),
    position: spot.position,
    scenes,
  };
}

function createSceneSummary(scene: SceneDefinition, locale: string): SceneSummary {
  return {
    id: scene.id,
    kind: scene.kind,
    title: localize(scene.title, locale),
    ...(scene.description ? { description: localize(scene.description, locale) } : {}),
    preview: scene.kind === "image" ? scene.media : scene.media.poster,
  };
}

function createSceneDetail(scene: SceneDefinition, locale: string): SceneDetail {
  const common = {
    id: scene.id,
    title: localize(scene.title, locale),
    ...(scene.description ? { description: localize(scene.description, locale) } : {}),
  };

  if (scene.kind === "image") {
    return { ...common, kind: "image", media: scene.media };
  }

  return {
    ...common,
    kind: "video",
    media: {
      src: scene.media.src,
      label: localize(scene.media.label, locale),
      poster: scene.media.poster,
    },
  };
}
