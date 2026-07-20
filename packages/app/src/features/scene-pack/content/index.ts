import { createSceneCatalog } from "../catalog.ts";
import type { SceneCatalog } from "../catalog.ts";
import type { ScenePackDefinition } from "../model.ts";
import type { Locale } from "#app/paraglide/runtime.js";
import { openHorizonsPack } from "./open-horizons-scene-pack.ts";
import { placeholderPack } from "./placeholder-scene-pack.ts";
import { rainyLakeCabinPack } from "./rainy-lake-cabin-scene-pack.ts";

const officialScenePacks = [
  openHorizonsPack,
  rainyLakeCabinPack,
  placeholderPack,
] satisfies readonly ScenePackDefinition[];

export function createOfficialSceneCatalog(locale: Locale, baseLocale: Locale): SceneCatalog {
  return createSceneCatalog(officialScenePacks, { locale, baseLocale });
}
