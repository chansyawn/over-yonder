import { useEffect, useState } from "react";
import type { SceneDetail } from "#app/features/scene-pack/model.ts";
import * as m from "#app/paraglide/messages.js";

interface SceneMediaProps {
  readonly scene: SceneDetail;
  readonly className?: string;
  readonly onError?: () => void;
}

export function SceneMedia({ scene, className, onError }: SceneMediaProps) {
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
        alt={scene.media.alt}
        className={className ?? "absolute inset-0 size-full object-cover"}
        height={scene.media.height}
        onError={handleError}
        src={scene.media.src}
        width={scene.media.width}
      />
    );
  }

  if (prefersReducedMotion) {
    return (
      <img
        alt={scene.media.poster.alt}
        className={className ?? "absolute inset-0 size-full object-cover"}
        height={scene.media.poster.height}
        onError={handleError}
        src={scene.media.poster.src}
        width={scene.media.poster.width}
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
