export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface VideoAsset {
  readonly src: string;
  readonly label: string;
  readonly poster: ImageAsset;
}

interface SceneDefinitionBase {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
}

export interface ImageSceneDefinition extends SceneDefinitionBase {
  readonly kind: "image";
  readonly media: ImageAsset;
}

export interface VideoSceneDefinition extends SceneDefinitionBase {
  readonly kind: "video";
  readonly media: VideoAsset;
}

export type SceneDefinition = ImageSceneDefinition | VideoSceneDefinition;

export interface SpotDefinition {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly position: {
    readonly x: number;
    readonly y: number;
  };
  readonly scenes: readonly SceneDefinition[];
}

export interface DestinationDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: ImageAsset;
  readonly spots: readonly SpotDefinition[];
}

export interface ScenePackDefinition {
  readonly id: string;
  readonly title: string;
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
