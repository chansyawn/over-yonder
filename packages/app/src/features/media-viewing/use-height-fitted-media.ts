import { type RefObject, useLayoutEffect } from "react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

const defaultMediaScale = 1;
const mediaAlignmentAnimationTime = 200;

export const minimumMediaScale = 0.1;

export interface MediaDimensions {
  readonly width: number;
  readonly height: number;
}

function getAlignedPosition(viewportSize: number, contentSize: number, position: number): number {
  if (contentSize <= viewportSize) {
    return (viewportSize - contentSize) / 2;
  }

  return Math.min(0, Math.max(viewportSize - contentSize, position));
}

export function alignMediaToViewport(ref: ReactZoomPanPinchRef): void {
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

export function useHeightFittedMedia(
  dimensions: MediaDimensions | undefined,
  transformRef: RefObject<ReactZoomPanPinchRef | null>,
) {
  const isReady = dimensions !== undefined;
  const aspectRatio = isReady ? dimensions.width / dimensions.height : undefined;
  const contentWidth = aspectRatio ? `calc(100dvh * ${aspectRatio})` : "100vw";

  useLayoutEffect(() => {
    if (dimensions) {
      transformRef.current?.centerView(defaultMediaScale, 0);
    }
  }, [dimensions, transformRef]);

  return { aspectRatio, contentWidth, isReady };
}
