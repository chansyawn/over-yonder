import {
  type ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { type ReactNode, useId, useLayoutEffect, useRef, useState } from "react";
import "./zoomable-media-viewport.css";

const defaultMediaScale = 1;
const maximumMediaScale = 3;
const mediaAlignmentAnimationTime = 200;
const minimumMediaScale = 0.1;

export interface MediaDimensions {
  readonly width: number;
  readonly height: number;
}

interface MediaRenderHandlers {
  readonly onError: () => void;
  readonly onReady: (dimensions: MediaDimensions) => void;
}

interface ZoomableMediaViewportProps {
  readonly ariaLabel: string;
  readonly backdropSrc: string;
  readonly failure: ReactNode;
  readonly interactionExclusionClassName?: string;
  readonly navigationHint: string;
  readonly overlay?: ReactNode;
  readonly renderMedia: (handlers: MediaRenderHandlers) => ReactNode;
}

interface MediaBackdropProps {
  readonly src: string;
}

function getAlignedPosition(viewportSize: number, contentSize: number, position: number): number {
  if (contentSize <= viewportSize) {
    return (viewportSize - contentSize) / 2;
  }

  return Math.min(0, Math.max(viewportSize - contentSize, position));
}

function alignMediaToViewport(ref: ReactZoomPanPinchRef): void {
  const { contentComponent, wrapperComponent } = ref.instance;
  if (!contentComponent || !wrapperComponent) {
    return;
  }

  const { positionX, positionY, scale } = ref.state;
  const targetPositionX = getAlignedPosition(
    wrapperComponent.offsetWidth,
    contentComponent.offsetWidth * scale,
    positionX,
  );
  const targetPositionY = getAlignedPosition(
    wrapperComponent.offsetHeight,
    contentComponent.offsetHeight * scale,
    positionY,
  );

  if (targetPositionX === positionX && targetPositionY === positionY) {
    return;
  }

  ref.setTransform(targetPositionX, targetPositionY, scale, mediaAlignmentAnimationTime, "easeOut");
}

function MediaBackdrop({ src }: MediaBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="bg-muted pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <img
        className="absolute inset-[-5%] h-[110%] w-[110%] max-w-none scale-105 object-cover opacity-75 blur-2xl saturate-75"
        draggable={false}
        src={src}
      />
      <div className="bg-panel/35 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,color-mix(in_oklab,var(--panel)_45%,transparent)_100%)]" />
    </div>
  );
}

export function ZoomableMediaViewport({
  ariaLabel,
  backdropSrc,
  failure,
  interactionExclusionClassName,
  navigationHint,
  overlay,
  renderMedia,
}: ZoomableMediaViewportProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const instructionsId = useId();
  const [mediaFailed, setMediaFailed] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState<MediaDimensions>();
  const mediaReady = mediaDimensions !== undefined;
  const mediaRatio = mediaReady ? mediaDimensions.width / mediaDimensions.height : undefined;
  const mediaWidth = mediaRatio ? `calc(100dvh * ${mediaRatio})` : "100vw";
  const interactionDisabled = mediaFailed || !mediaReady;
  const excludedTargets = interactionExclusionClassName ? [interactionExclusionClassName] : [];

  useLayoutEffect(() => {
    if (mediaDimensions) {
      transformRef.current?.centerView(defaultMediaScale, 0);
    }
  }, [mediaDimensions]);

  return (
    <>
      <p className="sr-only" id={instructionsId}>
        {navigationHint}
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
        maxScale={maximumMediaScale}
        minScale={minimumMediaScale}
        onPanningStop={alignMediaToViewport}
        onPinchStop={alignMediaToViewport}
        onZoomStop={alignMediaToViewport}
        panning={{ excluded: excludedTargets }}
        pinch={{ excluded: excludedTargets }}
        wheel={{ excluded: excludedTargets, step: 0.001 }}
        doubleClick={{ excluded: excludedTargets, mode: "zoomIn", step: 0.5 }}
      >
        {!mediaFailed ? <MediaBackdrop src={backdropSrc} /> : null}
        <TransformComponent
          contentClass="relative"
          contentStyle={{ width: mediaWidth }}
          wrapperClass="relative z-10 h-full w-full"
          wrapperProps={{
            "aria-describedby": instructionsId,
            "aria-label": ariaLabel,
            role: "region",
          }}
          wrapperStyle={{ height: "100%", width: "100%" }}
        >
          <div
            className={`relative w-full overflow-hidden select-none ${mediaReady ? "" : "h-dvh"}`}
            style={mediaDimensions ? { aspectRatio: mediaRatio } : undefined}
          >
            {mediaFailed ? (
              failure
            ) : (
              <div className="zoomable-media-feather absolute inset-0 size-full">
                {renderMedia({
                  onError: () => setMediaFailed(true),
                  onReady: setMediaDimensions,
                })}
              </div>
            )}
            {mediaReady && !mediaFailed ? overlay : null}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </>
  );
}
