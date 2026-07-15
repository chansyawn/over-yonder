export type LocalizedText = Readonly<Record<string, string>>;

export interface ImageAssetDefinition {
  readonly src: string;
}

export interface VideoAssetDefinition {
  readonly src: string;
  readonly label: LocalizedText;
  readonly poster: ImageAssetDefinition;
}

export interface ImageAsset {
  readonly src: string;
}

export interface VideoAsset {
  readonly src: string;
  readonly label: string;
  readonly poster: ImageAsset;
}

interface SceneDefinitionBase {
  readonly id: string;
  readonly title: LocalizedText;
  readonly description?: LocalizedText;
}

export interface ImageSceneDefinition extends SceneDefinitionBase {
  readonly kind: "image";
  readonly media: ImageAssetDefinition;
}

export interface VideoSceneDefinition extends SceneDefinitionBase {
  readonly kind: "video";
  readonly media: VideoAssetDefinition;
}

export type SceneDefinition = ImageSceneDefinition | VideoSceneDefinition;

export interface SpotDefinition {
  readonly id: string;
  readonly title: LocalizedText;
  readonly description?: LocalizedText;
  readonly position: {
    readonly x: number;
    readonly y: number;
  };
  readonly scenes: readonly SceneDefinition[];
}

export interface DestinationDefinition {
  readonly id: string;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly image: ImageAssetDefinition;
  readonly spots: readonly SpotDefinition[];
}

export interface ScenePackDefinition {
  readonly id: string;
  readonly locales: readonly string[];
  readonly title: LocalizedText;
  readonly destinations: readonly DestinationDefinition[];
}

export interface DestinationSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: ImageAsset;
  readonly spotCount: number;
  readonly sceneCount: number;
}

export interface SceneSummary {
  readonly id: string;
  readonly kind: SceneDefinition["kind"];
  readonly title: string;
  readonly description?: string;
  readonly preview: ImageAsset;
}

export interface SpotDetail {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly position: SpotDefinition["position"];
  readonly scenes: readonly SceneSummary[];
}

export interface DestinationDetail extends DestinationSummary {
  readonly spots: readonly SpotDetail[];
}

interface SceneDetailBase {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
}

export interface ImageSceneDetail extends SceneDetailBase {
  readonly kind: "image";
  readonly media: ImageAsset;
}

export interface VideoSceneDetail extends SceneDetailBase {
  readonly kind: "video";
  readonly media: VideoAsset;
}

export type SceneDetail = ImageSceneDetail | VideoSceneDetail;
