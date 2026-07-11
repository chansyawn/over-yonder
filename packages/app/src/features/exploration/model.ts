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

export interface CoordinateDefinition {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly position: {
    readonly x: number;
    readonly y: number;
  };
  readonly scenes: readonly SceneDefinition[];
}

export interface MapDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: ImageAsset;
  readonly coordinates: readonly CoordinateDefinition[];
}

export interface ScenePackDefinition {
  readonly id: string;
  readonly title: string;
  readonly maps: readonly MapDefinition[];
}

export interface MapSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: ImageAsset;
  readonly coordinateCount: number;
  readonly sceneCount: number;
}

export interface SceneSummary {
  readonly id: string;
  readonly kind: SceneDefinition["kind"];
  readonly title: string;
  readonly description?: string;
  readonly preview: ImageAsset;
}

export interface CoordinateDetail {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly position: CoordinateDefinition["position"];
  readonly scenes: readonly SceneSummary[];
}

export interface MapDetail extends MapSummary {
  readonly coordinates: readonly CoordinateDetail[];
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
