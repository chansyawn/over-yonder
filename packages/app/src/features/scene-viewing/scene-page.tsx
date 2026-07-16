import {
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { useRef, useState } from "react";
import {
  alignMediaToViewport,
  type MediaDimensions,
  minimumMediaScale,
  useHeightFittedMedia,
} from "#app/features/media-viewing/use-height-fitted-media.ts";
import { PageNavigation } from "#app/features/page-navigation/page-navigation.tsx";
import type { DestinationDetail, SceneDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";
import { SceneMedia } from "./scene-media.tsx";
import "./scene-page.css";

const maxSceneScale = 3;

interface ScenePageProps {
  readonly destination: DestinationDetail;
  readonly scene: SceneDetail;
}

interface SceneBackdropProps {
  readonly scene: SceneDetail;
}

function SceneBackdrop({ scene }: SceneBackdropProps) {
  const image = scene.kind === "image" ? scene.media : scene.media.poster;

  return (
    <div
      aria-hidden="true"
      className="bg-muted pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <img
        className="absolute inset-[-5%] h-[110%] w-[110%] max-w-none scale-105 object-cover opacity-75 blur-2xl saturate-75"
        draggable={false}
        src={image.src}
      />
      <div className="bg-panel/35 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,color-mix(in_oklab,var(--panel)_45%,transparent)_100%)]" />
    </div>
  );
}

export function ScenePage({ destination, scene }: ScenePageProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState<MediaDimensions>();
  const {
    aspectRatio: mediaRatio,
    contentWidth: mediaWidth,
    isReady: mediaReady,
  } = useHeightFittedMedia(mediaDimensions, transformRef);
  const interactionDisabled = mediaFailed || !mediaReady;

  return (
    <main className="bg-muted relative h-dvh min-h-0 overflow-hidden text-black">
      <p className="sr-only" id="scene-navigation-instructions">
        {m.scene_navigation_hint()}
      </p>
      <TransformWrapper
        ref={transformRef}
        autoAlignment={{
          animationTime: 200,
          animationType: "easeOut",
          disabled: false,
          sizeX: 100,
          sizeY: 100,
        }}
        centerOnInit
        disabled={interactionDisabled}
        limitToBounds
        maxScale={maxSceneScale}
        minScale={minimumMediaScale}
        onPanningStop={alignMediaToViewport}
        onPinchStop={alignMediaToViewport}
        onZoomStop={alignMediaToViewport}
        wheel={{ step: 0.001 }}
        doubleClick={{ mode: "zoomIn", step: 0.5 }}
      >
        {!mediaFailed ? <SceneBackdrop scene={scene} /> : null}
        <TransformComponent
          contentClass="relative"
          contentStyle={{ width: mediaWidth }}
          wrapperClass="relative z-10 h-full w-full"
          wrapperProps={{
            "aria-describedby": "scene-navigation-instructions",
            "aria-label": m.scene_view_label(),
            role: "region",
          }}
          wrapperStyle={{ height: "100%", width: "100%" }}
        >
          <div
            className={`relative w-full overflow-hidden select-none ${mediaReady ? "" : "h-dvh"}`}
            style={mediaDimensions ? { aspectRatio: mediaRatio } : undefined}
          >
            <SceneMedia
              className="scene-media-feather absolute inset-0 size-full object-contain"
              scene={scene}
              onError={() => setMediaFailed(true)}
              onReady={setMediaDimensions}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
      <h1 className="sr-only">{scene.title}</h1>
      <PageNavigation destinationId={destination.id} destinationTitle={destination.title} />
    </main>
  );
}
