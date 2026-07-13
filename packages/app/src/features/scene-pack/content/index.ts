import { createSceneCatalog } from "../catalog.ts";
import type { SceneCatalog } from "../catalog.ts";
import { openHorizonsPack } from "./open-horizons-scene-pack.ts";

export function createOfficialSceneCatalog(): SceneCatalog {
  return createSceneCatalog([openHorizonsPack]);
}
