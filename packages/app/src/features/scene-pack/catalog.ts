import type {
  DestinationDefinition,
  DestinationDetail,
  DestinationSummary,
  SceneDefinition,
  SceneDetail,
  ScenePackDefinition,
  SceneSummary,
} from "./model.ts";
import { localize, resolvePackLocale } from "./localization.ts";
import { ensureUnique, validateDestination, validatePack, validateScene } from "./validation.ts";

export interface SceneCatalog {
  listDestinations(): readonly DestinationSummary[];
  getDestination(packId: string, destinationId: string): DestinationDetail | undefined;
  getScene(packId: string, destinationId: string, sceneId: string): SceneDetail | undefined;
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
  const destinationSummaries: DestinationSummary[] = [];
  const destinationsByPackId = new Map<string, Map<string, DestinationDetail>>();
  const scenesByPackId = new Map<string, Map<string, Map<string, SceneDetail>>>();

  for (const pack of packs) {
    const packPath = `pack ${JSON.stringify(pack.id)}`;
    validatePack(pack, packPath);
    ensureUnique(packIds, pack.id, "pack");
    const resolvedLocale = resolvePackLocale(pack.locales, locale, baseLocale);
    const destinationIds = new Set<string>();
    const destinationsById = new Map<string, DestinationDetail>();
    const scenesByDestinationId = new Map<string, Map<string, SceneDetail>>();

    for (const destination of pack.destinations) {
      const destinationPath = `${packPath}, destination ${JSON.stringify(destination.id)}`;
      validateDestination(destination, pack.locales, destinationPath);
      ensureUnique(destinationIds, destination.id, "destination");
      const sceneIds = new Set<string>();
      const scenesById = new Map<string, SceneDetail>();
      const scenes = destination.scenes.map((scene) => {
        const scenePath = `${destinationPath}, scene ${JSON.stringify(scene.id)}`;
        validateScene(scene, pack.locales, scenePath);
        ensureUnique(sceneIds, scene.id, "scene");

        const detail = createSceneDetail(scene, resolvedLocale);
        scenesById.set(scene.id, detail);
        return createSceneSummary(scene, resolvedLocale);
      });

      const summary = createDestinationSummary(pack.id, destination, scenes.length, resolvedLocale);
      const detail: DestinationDetail = {
        ...summary,
        scenes,
      };

      destinationSummaries.push(summary);
      destinationsById.set(destination.id, detail);
      scenesByDestinationId.set(destination.id, scenesById);
    }

    destinationsByPackId.set(pack.id, destinationsById);
    scenesByPackId.set(pack.id, scenesByDestinationId);
  }

  return {
    listDestinations() {
      return destinationSummaries;
    },
    getDestination(packId, destinationId) {
      return destinationsByPackId.get(packId)?.get(destinationId);
    },
    getScene(packId, destinationId, sceneId) {
      return scenesByPackId.get(packId)?.get(destinationId)?.get(sceneId);
    },
  };
}

function createDestinationSummary(
  packId: string,
  destination: DestinationDefinition,
  sceneCount: number,
  locale: string,
): DestinationSummary {
  return {
    packId,
    id: destination.id,
    title: localize(destination.title, locale),
    description: localize(destination.description, locale),
    image: destination.image,
    sceneCount,
  };
}

function createSceneSummary(scene: SceneDefinition, locale: string): SceneSummary {
  return {
    id: scene.id,
    kind: scene.kind,
    title: localize(scene.title, locale),
    ...(scene.description ? { description: localize(scene.description, locale) } : {}),
    position: scene.position,
    preview: scene.kind === "image" ? scene.media : scene.media.poster,
  };
}

function createSceneDetail(scene: SceneDefinition, locale: string): SceneDetail {
  const common = {
    id: scene.id,
    title: localize(scene.title, locale),
    ...(scene.description ? { description: localize(scene.description, locale) } : {}),
    position: scene.position,
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
