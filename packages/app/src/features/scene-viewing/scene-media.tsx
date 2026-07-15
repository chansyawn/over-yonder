import { useEffect, useState } from "react";
import type { SceneDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";

interface MediaDimensions {
  readonly width: number;
  readonly height: number;
}

interface SceneMediaProps {
  readonly scene: SceneDetail;
  readonly className?: string;
  readonly onError?: () => void;
  readonly onReady?: (dimensions: MediaDimensions) => void;
}

export function SceneMedia({ scene, className, onError, onReady }: SceneMediaProps) {
  const [failed, setFailed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleError = () => {
    setFailed(true);
    onError?.();
  };

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white p-8 text-center text-black">
        <div>
          <h2 className="text-2xl font-semibold">{m.scene_media_unavailable()}</h2>
          <p className="mt-2 text-sm">{m.scene_media_unavailable_hint()}</p>
        </div>
      </div>
    );
  }

  if (scene.kind === "image") {
    return (
      <img
        className={className ?? "absolute inset-0 size-full object-cover"}
        onLoad={(event) =>
          onReady?.({
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
          })
        }
        onError={handleError}
        src={scene.media.src}
      />
    );
  }

  if (prefersReducedMotion) {
    return (
      <img
        className={className ?? "absolute inset-0 size-full object-cover"}
        onLoad={(event) =>
          onReady?.({
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
          })
        }
        onError={handleError}
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
        onReady?.({
          width: event.currentTarget.videoWidth,
          height: event.currentTarget.videoHeight,
        })
      }
      onError={handleError}
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
