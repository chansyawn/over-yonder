import { createSceneCatalog } from "../catalog.ts";
import type { SceneCatalog } from "../catalog.ts";
import type { ScenePackDefinition } from "../model.ts";
import { openHorizonsPack } from "./open-horizons-scene-pack.ts";
import { placeholderPack } from "./placeholder-scene-pack.ts";

const officialScenePacks = [
  openHorizonsPack,
  placeholderPack,
] satisfies readonly ScenePackDefinition[];

export function createOfficialSceneCatalog(): SceneCatalog {
  return createSceneCatalog(officialScenePacks);
}
