import type {
  DestinationDefinition,
  DestinationDetail,
  DestinationSummary,
  ImageAsset,
  SceneDefinition,
  SceneDetail,
  ScenePackDefinition,
  SceneSummary,
  SpotDefinition,
  SpotDetail,
  VideoAsset,
} from "./model.ts";

export interface SceneCatalog {
  listDestinations(): readonly DestinationSummary[];
  getDestination(destinationId: string): DestinationDetail | undefined;
  getScene(destinationId: string, sceneId: string): SceneDetail | undefined;
}
interface IndexedScene {
  readonly destinationId: string;
  readonly detail: SceneDetail;
}

export function createSceneCatalog(packs: readonly ScenePackDefinition[]): SceneCatalog {
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
    validateIdentity(pack.id, pack.title, packPath);
    ensureUnique(packIds, pack.id, "pack");

    if (pack.destinations.length === 0) {
      throw new Error(`${packPath} must contain at least one destination.`);
    }

    for (const destination of pack.destinations) {
      const destinationPath = `${packPath}, destination ${JSON.stringify(destination.id)}`;
      validateDestination(destination, destinationPath);
      ensureUnique(destinationIds, destination.id, "destination");

      const spots = destination.spots.map((spot) => {
        const spotPath = `${destinationPath}, spot ${JSON.stringify(spot.id)}`;
        validateSpot(spot, spotPath);
        ensureUnique(spotIds, spot.id, "spot");

        const scenes = spot.scenes.map((scene) => {
          const scenePath = `${spotPath}, scene ${JSON.stringify(scene.id)}`;
          validateScene(scene, scenePath);
          ensureUnique(sceneIds, scene.id, "scene");

          const detail = createSceneDetail(scene);
          scenesById.set(scene.id, { destinationId: destination.id, detail });
          return createSceneSummary(scene);
        });

        return createSpotDetail(spot, scenes);
      });

      const sceneCount = spots.reduce((count, spot) => count + spot.scenes.length, 0);
      const summary = createDestinationSummary(destination, sceneCount);
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
): DestinationSummary {
  return {
    id: destination.id,
    title: destination.title,
    description: destination.description,
    image: destination.image,
    spotCount: destination.spots.length,
    sceneCount,
  };
}

function createSpotDetail(spot: SpotDefinition, scenes: readonly SceneSummary[]): SpotDetail {
  return {
    id: spot.id,
    title: spot.title,
    ...(spot.description ? { description: spot.description } : {}),
    position: spot.position,
    scenes,
  };
}

function createSceneSummary(scene: SceneDefinition): SceneSummary {
  return {
    id: scene.id,
    kind: scene.kind,
    title: scene.title,
    ...(scene.description ? { description: scene.description } : {}),
    preview: scene.kind === "image" ? scene.media : scene.media.poster,
  };
}

function createSceneDetail(scene: SceneDefinition): SceneDetail {
  const common = {
    id: scene.id,
    title: scene.title,
    ...(scene.description ? { description: scene.description } : {}),
  };

  if (scene.kind === "image") {
    return { ...common, kind: "image", media: scene.media };
  }

  return { ...common, kind: "video", media: scene.media };
}

function validateDestination(destination: DestinationDefinition, path: string): void {
  validateIdentity(destination.id, destination.title, path);
  assertNonEmpty(destination.description, `${path} description`);
  validateImage(destination.image, `${path} image`);

  if (destination.spots.length === 0) {
    throw new Error(`${path} must contain at least one spot.`);
  }
}

function validateSpot(spot: SpotDefinition, path: string): void {
  validateIdentity(spot.id, spot.title, path);
  validateNormalizedPosition(spot.position.x, `${path} x`);
  validateNormalizedPosition(spot.position.y, `${path} y`);

  if (spot.scenes.length === 0) {
    throw new Error(`${path} must contain at least one scene.`);
  }
}

function validateScene(scene: SceneDefinition, path: string): void {
  validateIdentity(scene.id, scene.title, path);

  const kind = (scene as { readonly kind: unknown }).kind;
  if (kind !== "image" && kind !== "video") {
    throw new Error(`${path} kind must be either "image" or "video".`);
  }

  if (scene.kind === "image") {
    validateImage(scene.media, `${path} media`);
    return;
  }

  validateVideo(scene.media, `${path} media`);
}

function validateVideo(video: VideoAsset, path: string): void {
  assertNonEmpty(video.src, `${path} source`);
  assertNonEmpty(video.label, `${path} label`);
  validateImage(video.poster, `${path} poster`);
}

function validateImage(image: ImageAsset, path: string): void {
  assertNonEmpty(image.src, `${path} source`);
  assertNonEmpty(image.alt, `${path} alt text`);
  validateDimension(image.width, `${path} width`);
  validateDimension(image.height, `${path} height`);
}

function validateIdentity(id: string, title: string, path: string): void {
  assertNonEmpty(id, `${path} id`);
  assertNonEmpty(title, `${path} title`);
}

function validateNormalizedPosition(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be between 0 and 1.`);
  }
}

function validateDimension(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function assertNonEmpty(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must not be empty.`);
  }
}

function ensureUnique(ids: Set<string>, id: string, entity: string): void {
  if (ids.has(id)) {
    throw new Error(`Duplicate ${entity} id ${JSON.stringify(id)}.`);
  }

  ids.add(id);
}
