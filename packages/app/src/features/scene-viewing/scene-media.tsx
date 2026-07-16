import { useEffect, useState } from "react";
import type { MediaDimensions } from "#app/features/media-viewing/zoomable-media-viewport.tsx";
import type { SceneDetail } from "#app/features/scene-pack/model.ts";

interface SceneMediaProps {
  readonly scene: SceneDetail;
  readonly className?: string;
  readonly onError: () => void;
  readonly onReady: (dimensions: MediaDimensions) => void;
}

export function SceneMedia({ scene, className, onError, onReady }: SceneMediaProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (scene.kind === "image") {
    return (
      <img
        className={className ?? "absolute inset-0 size-full object-cover"}
        onLoad={(event) =>
          onReady({
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
          })
        }
        onError={onError}
        src={scene.media.src}
      />
    );
  }

  if (prefersReducedMotion) {
    return (
      <img
        className={className ?? "absolute inset-0 size-full object-cover"}
        onLoad={(event) =>
          onReady({
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
          })
        }
        onError={onError}
        src={scene.media.poster.src}
      />
    );
  }

  return (
    <video
      aria-label={scene.media.label}
      autoPlay
      className={className ?? "absolute inset-0 size-full object-cover"}
      loop
      muted
      playsInline
      poster={scene.media.poster.src}
      preload="auto"
      src={scene.media.src}
      onLoadedMetadata={(event) =>
        onReady({
          width: event.currentTarget.videoWidth,
          height: event.currentTarget.videoHeight,
        })
      }
      onError={onError}
    />
  );
}

function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return matches;
}
