import type {
  CoordinateDefinition,
  CoordinateDetail,
  ImageAsset,
  MapDefinition,
  MapDetail,
  MapSummary,
  SceneDefinition,
  SceneDetail,
  ScenePackDefinition,
  SceneSummary,
  VideoAsset,
} from "./model.ts";

export interface SceneCatalog {
  listMaps(): readonly MapSummary[];
  getMap(mapId: string): MapDetail | undefined;
  getScene(mapId: string, sceneId: string): SceneDetail | undefined;
}
interface IndexedScene {
  readonly mapId: string;
  readonly detail: SceneDetail;
}

export function createSceneCatalog(packs: readonly ScenePackDefinition[]): SceneCatalog {
  if (packs.length === 0) {
    throw new Error("Scene catalog must contain at least one pack.");
  }

  const packIds = new Set<string>();
  const mapIds = new Set<string>();
  const coordinateIds = new Set<string>();
  const sceneIds = new Set<string>();
  const mapSummaries: MapSummary[] = [];
  const mapsById = new Map<string, MapDetail>();
  const scenesById = new Map<string, IndexedScene>();

  for (const pack of packs) {
    const packPath = `pack ${JSON.stringify(pack.id)}`;
    validateIdentity(pack.id, pack.title, packPath);
    ensureUnique(packIds, pack.id, "pack");

    if (pack.maps.length === 0) {
      throw new Error(`${packPath} must contain at least one map.`);
    }

    for (const map of pack.maps) {
      const mapPath = `${packPath}, map ${JSON.stringify(map.id)}`;
      validateMap(map, mapPath);
      ensureUnique(mapIds, map.id, "map");

      const coordinates = map.coordinates.map((coordinate) => {
        const coordinatePath = `${mapPath}, coordinate ${JSON.stringify(coordinate.id)}`;
        validateCoordinate(coordinate, coordinatePath);
        ensureUnique(coordinateIds, coordinate.id, "coordinate");

        const scenes = coordinate.scenes.map((scene) => {
          const scenePath = `${coordinatePath}, scene ${JSON.stringify(scene.id)}`;
          validateScene(scene, scenePath);
          ensureUnique(sceneIds, scene.id, "scene");

          const detail = createSceneDetail(scene);
          scenesById.set(scene.id, { mapId: map.id, detail });
          return createSceneSummary(scene);
        });

        return createCoordinateDetail(coordinate, scenes);
      });

      const sceneCount = coordinates.reduce(
        (count, coordinate) => count + coordinate.scenes.length,
        0,
      );
      const summary = createMapSummary(map, sceneCount);
      const detail: MapDetail = {
        ...summary,
        coordinates,
      };

      mapSummaries.push(summary);
      mapsById.set(map.id, detail);
    }
  }

  return {
    listMaps() {
      return mapSummaries;
    },
    getMap(mapId) {
      return mapsById.get(mapId);
    },
    getScene(mapId, sceneId) {
      const scene = scenesById.get(sceneId);
      return scene?.mapId === mapId ? scene.detail : undefined;
    },
  };
}

function createMapSummary(map: MapDefinition, sceneCount: number): MapSummary {
  return {
    id: map.id,
    title: map.title,
    description: map.description,
    image: map.image,
    coordinateCount: map.coordinates.length,
    sceneCount,
  };
}

function createCoordinateDetail(
  coordinate: CoordinateDefinition,
  scenes: readonly SceneSummary[],
): CoordinateDetail {
  return {
    id: coordinate.id,
    title: coordinate.title,
    ...(coordinate.description ? { description: coordinate.description } : {}),
    position: coordinate.position,
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

function validateMap(map: MapDefinition, path: string): void {
  validateIdentity(map.id, map.title, path);
  assertNonEmpty(map.description, `${path} description`);
  validateImage(map.image, `${path} image`);

  if (map.coordinates.length === 0) {
    throw new Error(`${path} must contain at least one coordinate.`);
  }
}

function validateCoordinate(coordinate: CoordinateDefinition, path: string): void {
  validateIdentity(coordinate.id, coordinate.title, path);
  validateNormalizedPosition(coordinate.position.x, `${path} x`);
  validateNormalizedPosition(coordinate.position.y, `${path} y`);

  if (coordinate.scenes.length === 0) {
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
