import { createSceneCatalog } from "../catalog.ts";
import type { SceneCatalog } from "../catalog.ts";
import type { Locale } from "#app/paraglide/runtime.js";
import { placeholderPack } from "./placeholder-scene-pack.ts";
import { rainyLakeCabinPack } from "./rainy-lake-cabin-scene-pack.ts";

const officialScenePacks = [rainyLakeCabinPack, placeholderPack];

export function createOfficialSceneCatalog(locale: Locale, baseLocale: Locale): SceneCatalog {
  return createSceneCatalog(officialScenePacks, { locale, baseLocale });
}
