import type {
  DestinationDefinition,
  ImageAssetDefinition,
  LocalizedText,
  SceneDefinition,
  ScenePackDefinition,
  SpotDefinition,
  VideoAssetDefinition,
} from "./model.ts";

export function validatePack(pack: ScenePackDefinition, path: string): void {
  validateId(pack.id, path);
  validateLocales(pack.locales, path);
  validateLocalizedText(pack.title, pack.locales, `${path} title`);

  if (pack.destinations.length === 0) {
    throw new Error(`${path} must contain at least one destination.`);
  }
}

export function validateDestination(
  destination: DestinationDefinition,
  locales: readonly string[],
  path: string,
): void {
  validateIdentity(destination.id, destination.title, locales, path);
  validateLocalizedText(destination.description, locales, `${path} description`);
  validateImage(destination.image, `${path} image`);

  if (destination.spots.length === 0) {
    throw new Error(`${path} must contain at least one spot.`);
  }
}

export function validateSpot(spot: SpotDefinition, locales: readonly string[], path: string): void {
  validateIdentity(spot.id, spot.title, locales, path);
  if (spot.description) {
    validateLocalizedText(spot.description, locales, `${path} description`);
  }
  validateNormalizedPosition(spot.position.x, `${path} x`);
  validateNormalizedPosition(spot.position.y, `${path} y`);

  if (spot.scenes.length === 0) {
    throw new Error(`${path} must contain at least one scene.`);
  }
}

export function validateScene(
  scene: SceneDefinition,
  locales: readonly string[],
  path: string,
): void {
  validateIdentity(scene.id, scene.title, locales, path);
  if (scene.description) {
    validateLocalizedText(scene.description, locales, `${path} description`);
  }

  const kind = (scene as { readonly kind: unknown }).kind;
  if (kind !== "image" && kind !== "video") {
    throw new Error(`${path} kind must be either "image" or "video".`);
  }

  if (scene.kind === "image") {
    validateImage(scene.media, `${path} media`);
    return;
  }

  validateVideo(scene.media, locales, `${path} media`);
}

export function ensureUnique(ids: Set<string>, id: string, entity: string): void {
  if (ids.has(id)) {
    throw new Error(`Duplicate ${entity} id ${JSON.stringify(id)}.`);
  }

  ids.add(id);
}

function validateVideo(
  video: VideoAssetDefinition,
  locales: readonly string[],
  path: string,
): void {
  assertNonEmpty(video.src, `${path} source`);
  validateLocalizedText(video.label, locales, `${path} label`);
  validateImage(video.poster, `${path} poster`);
}

function validateImage(image: ImageAssetDefinition, path: string): void {
  assertNonEmpty(image.src, `${path} source`);
}

function validateIdentity(
  id: string,
  title: LocalizedText,
  locales: readonly string[],
  path: string,
): void {
  validateId(id, path);
  validateLocalizedText(title, locales, `${path} title`);
}

function validateId(id: string, path: string): void {
  assertNonEmpty(id, `${path} id`);
}

function validateLocales(locales: readonly string[], path: string): void {
  if (locales.length === 0) {
    throw new Error(`${path} must declare at least one locale.`);
  }

  const canonicalLocales = new Set<string>();
  for (const locale of locales) {
    let canonicalLocale: string;
    try {
      canonicalLocale = Intl.getCanonicalLocales(locale)[0] ?? "";
    } catch {
      throw new Error(`${path} locale ${JSON.stringify(locale)} must be a valid BCP-47 tag.`);
    }

    if (!canonicalLocale || canonicalLocales.has(canonicalLocale)) {
      throw new Error(`${path} contains duplicate locale ${JSON.stringify(locale)}.`);
    }
    canonicalLocales.add(canonicalLocale);
  }
}

function validateLocalizedText(
  text: LocalizedText,
  locales: readonly string[],
  path: string,
): void {
  const declaredLocales = new Set(locales);
  for (const locale of locales) {
    if (!Object.hasOwn(text, locale)) {
      throw new Error(`${path} must provide a translation for ${JSON.stringify(locale)}.`);
    }
    assertNonEmpty(text[locale] ?? "", `${path} translation ${JSON.stringify(locale)}`);
  }

  for (const locale of Object.keys(text)) {
    if (!declaredLocales.has(locale)) {
      throw new Error(`${path} uses undeclared locale ${JSON.stringify(locale)}.`);
    }
  }
}

function validateNormalizedPosition(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be between 0 and 1.`);
  }
}

function assertNonEmpty(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must not be empty.`);
  }
}
